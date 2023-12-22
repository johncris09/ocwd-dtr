import * as XLSX from "xlsx";
import React, { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownload } from "@fortawesome/free-solid-svg-icons";
import { useDropzone } from "react-dropzone";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import {
  Table,
  DataTableCell,
  TableBody,
  TableCell,
  TableHeader,
} from "@david.kucsai/react-pdf-table";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [records, setRecords] = useState([]);

  const transformData = (originalData) => {
    const transformedData = [];
    let currentEntry = {};

    originalData.forEach((row, index) => {
      if (typeof row[2] === "string" && row[2].includes("Name:")) {
        currentEntry = {
          name: row[2].split(":")[1].trim(),
        };
        transformedData.push(currentEntry);
      }
      if (typeof row[13] === "string" && row[13].includes("Date:")) {
        currentEntry.period = row[13].split(":")[1].trim();
        currentEntry.time = [];
      }

      if (typeof row[0] === "string" && row[0].match(/^\d{2}-\d{2}$/)) {
        const [date, day] = row;
        const [inTime1, outTime1, inTime2, outTime2] = row.slice(2);

        const timeEntry = {
          date,
          day,
          inTime1: inTime1 || 0,
          outTime1: outTime1 || 0,
          inTime2: inTime2 || 0,
          outTime2: outTime2 || 0,
          undertime: 0,
        };

        currentEntry.time.push({ ...timeEntry });
      }
    });

    return transformedData;
  };

  const onDrop = useCallback((acceptedFiles) => {
    // Check if only one file is dropped
    if (acceptedFiles.length === 1) {
      const file = acceptedFiles[0];
      if (file.type !== "application/vnd.ms-excel") {
        console.error("Please upload an Excel file only.");
      } else {
        const reader = new FileReader();
        reader.onload = (acceptedFiles) => {
          const data = new Uint8Array(acceptedFiles.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          // Specify the sheet name you want to read
          const sheetName = "Attend. Report";
          const worksheet = workbook.Sheets[sheetName];

          // Convert the selected sheet to JSON
          const records = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Process records and update state
          const transformedData = transformData(records);

          setRecords(transformedData);
        };

        reader.readAsArrayBuffer(file);
      }
    } else {
      // toast.error("Please upload only one file.");
      console.error("Please upload only one file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".xlsx, .xls",
  });

  Font.register({
    family: "Roboto",
    fonts: [
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      },
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
        fontWeight: "bolder",
      },
    ],
  });

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      marginTop: "0.5in",
    },
    column: {
      flex: 1,
      margin: 10,
      padding: 10,
      // textAlign: "center",
    },
    title: {
      fontSize: 18,
      marginBottom: 10,
    },
    content: {
      fontSize: 12,
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
    },
    tableCol: {
      width: "25%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    cell: {
      margin: "auto",
      marginTop: 5,
    },
    colspanCell: {
      margin: "auto",
      marginTop: 5,
      width: "50%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    userInfo: {
      fontSize: 10,
      flexDirection: "row",
    },

    line: {
      borderBottomWidth: 2,
      borderColor: "black",
      width: "100%",
    },

    container: {
      display: "flex",
    },

    pagecolumn: {
      flex: 1,
      padding: "20px",
    },

    column1: {
      flex: "40%",
      backgroundColor: "#f0f0f0",
    },

    column2: {
      flex: "60%",
      backgroundColor: "#e0e0e0",
    },
  });

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-4">
            <div {...getRootProps()} style={dropzoneStyle}>
              <input
                {...getInputProps()}
                accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
              {isDragActive ? (
                <p>Drop the Excel file here...</p>
              ) : (
                <>
                  <p>
                    <FontAwesomeIcon
                      icon={faCloudDownload}
                      style={{ color: "blue", fontSize: 70 }}
                    />
                  </p>
                  <p>
                    {" "}
                    Drag and drop an Excel file here, or click to select one{" "}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="col-8">
            <div>
              {records.length > 0 && (
                <PDFViewer
                  style={{
                    width: "100%",
                    height: "100vh",
                  }}
                >
                  <Document
                    title="Daily Time Record"
                    keywords="document, pdf"
                    subject="DTR"
                    pdfVersion="1.3"
                  >
                    {records.map((item, index) => (
                      <Page
                        key={index}
                        size="A4"
                        style={{
                          ...styles.page,
                        }}
                      >
                        {/* Left column */}
                        <View style={styles.column} fixed>
                          <view style={{ width: "90%", marginLeft: 35 }}>
                            <Text
                              style={{
                                ...styles.title,
                                textAlign: "center",
                                marginBottom: 7,
                              }}
                            >
                              DAILY TIME RECORD
                            </Text>
                            <View style={styles.userInfo} fixed>
                              <Text style={{ marginLeft: 40 }}>NAME</Text>
                              <Text style={{ marginLeft: 35 }}>
                                {item.name}
                              </Text>
                            </View>
                            <View
                              style={{ ...styles.userInfo, marginBottom: 15 }}
                              fixed
                            >
                              <Text style={{ marginLeft: 40 }}>PERIOD</Text>
                              <Text style={{ marginLeft: 26 }}>
                                {item.period}
                              </Text>
                            </View>
                            <View>
                              <Table data={item.time}>
                                <TableHeader fontSize={10} textAlign={"center"}>
                                  <TableCell>Date</TableCell>
                                  <TableCell>AM</TableCell>
                                  <TableCell>PM</TableCell>
                                  <TableCell>Undefined</TableCell>
                                </TableHeader>
                                <TableBody fontSize={10}>
                                  <DataTableCell
                                    getContent={(r) => (
                                      <Table data={[r]} isNested={true}>
                                        <TableBody
                                          fontSize={10}
                                          textAlign={"center"}
                                          includeTopBorder={false}
                                          includeBottomBorder={false}
                                          includeLeftBorder={false}
                                          includeRightBorder={false}
                                        >
                                          <DataTableCell
                                            getContent={(r) => r.date}
                                          />
                                          <DataTableCell
                                            getContent={(r) => r.day}
                                          />
                                        </TableBody>
                                      </Table>
                                    )}
                                  />
                                  <DataTableCell
                                    getContent={(r) => (
                                      <Table data={[r]} isNested={true}>
                                        <TableBody
                                          fontSize={10}
                                          textAlign={"right"}
                                          includeTopBorder={false}
                                          includeBottomBorder={false}
                                          includeLeftBorder={false}
                                          includeRightBorder={false}
                                        >
                                          <DataTableCell
                                            getContent={(r) => (
                                              <Text style={{ marginRight: 1 }}>
                                                {r.inTime1}
                                              </Text>
                                            )}
                                          />
                                          <DataTableCell
                                            getContent={(r) => (
                                              <Text style={{ marginRight: 1 }}>
                                                {r.outTime1}
                                              </Text>
                                            )}
                                          />
                                        </TableBody>
                                      </Table>
                                    )}
                                  />
                                  <DataTableCell
                                    getContent={(r) => (
                                      <Table data={[r]} isNested={true}>
                                        <TableBody
                                          fontSize={10}
                                          textAlign={"right"}
                                          includeTopBorder={false}
                                          includeBottomBorder={false}
                                          includeLeftBorder={false}
                                          includeRightBorder={false}
                                        >
                                          <DataTableCell
                                            getContent={(r) => (
                                              <Text style={{ marginRight: 1 }}>
                                                {r.inTime2}
                                              </Text>
                                            )}
                                          />
                                          <DataTableCell
                                            getContent={(r) => (
                                              <Text style={{ marginRight: 1 }}>
                                                {r.outTime2}
                                              </Text>
                                            )}
                                          />
                                        </TableBody>
                                      </Table>
                                    )}
                                  />

                                  <DataTableCell
                                    getContent={(r) => (
                                      <Table data={[r]} isNested={true}>
                                        <TableBody
                                          fontSize={10}
                                          textAlign={"right"}
                                          includeTopBorder={false}
                                          includeBottomBorder={false}
                                          includeLeftBorder={false}
                                          includeRightBorder={false}
                                        >
                                          <DataTableCell
                                            getContent={(r) => (
                                              <Text style={{ marginRight: 1 }}>
                                                {r.undertime}
                                              </Text>
                                            )}
                                          />
                                        </TableBody>
                                      </Table>
                                    )}
                                  />
                                </TableBody>
                              </Table>
                              <view
                                style={{
                                  fontSize: 10,
                                  borderLeft: "1px solid black",
                                  borderRight: "1px solid black",
                                  borderBottom: "1px solid black",
                                  flexDirection: "row",
                                }}
                              >
                                <View
                                  style={{
                                    textAlign: "right",
                                    width: 177,
                                    borderRight: "1px solid black",
                                  }}
                                >
                                  <Text style={{ marginRight: 1 }}>
                                    Total Undertime
                                  </Text>
                                </View>

                                <View style={{ textAlign: "right", width: 58 }}>
                                  <Text style={{ marginRight: 1 }}>0</Text>
                                </View>
                              </view>
                            </View>

                            <Text style={{ fontSize: 10, marginTop: 30 }}>
                              I certify on my honor that the above is a true and
                              correct report of the hours of work performed,
                              record of which was made daily at the time of
                              arrival and departure from office.
                            </Text>
                            {/* Horizontal Line */}
                            <View
                              style={{
                                ...styles.line,
                                marginTop: 40,
                                marginBottom: 15,
                              }}
                            />
                            <Text style={{ fontSize: 10, textAlign: "center" }}>
                              Verified as to the prescribed office hours
                            </Text>
                            <View
                              style={{
                                ...styles.line,
                                marginTop: 40,
                                marginBottom: 15,
                              }}
                            />
                            <View
                              style={{
                                ...styles.line,
                                marginTop: 25,
                                borderBottomWidth: 1,
                              }}
                            />
                          </view>
                        </View>

                        {/* Right column */}
                        <View style={styles.column} fixed>
                          <view style={{ width: "90%", marginLeft: -10 }}>
                            <Text
                              style={{
                                ...styles.title,
                                textAlign: "center",
                                marginBottom: 7,
                              }}
                            >
                              DAILY TIME RECORD
                            </Text>
                            <View style={styles.userInfo} fixed>
                              <Text style={{ marginLeft: 40 }}>NAME</Text>
                              <Text style={{ marginLeft: 35 }}>
                                {item.name}
                              </Text>
                            </View>
                            <View
                              style={{ ...styles.userInfo, marginBottom: 15 }}
                              fixed
                            >
                              <Text style={{ marginLeft: 40 }}>PERIOD</Text>
                              <Text style={{ marginLeft: 26 }}>
                                {item.period}
                              </Text>
                            </View>
                            <View>
                              <Table data={item.time}>
                                <TableHeader fontSize={10} textAlign={"center"}>
                                  <TableCell>Date</TableCell>
                                  <TableCell>AM</TableCell>
                                  <TableCell>PM</TableCell>
                                  <TableCell>Undefined</TableCell>
                                </TableHeader>
                                <TableBody fontSize={10}>
                                  <DataTableCell
                                    getContent={(r) => (
                                      <Table data={[r]} isNested={true}>
                                        <TableBody
                                          fontSize={10}
                                          textAlign={"center"}
                                          includeTopBorder={false}
                                          includeBottomBorder={false}
                                          includeLeftBorder={false}
                                          includeRightBorder={false}
                                        >
                                          <DataTableCell
                                            getContent={(r) => r.date}
                                          />
                                          <DataTableCell
                                            getContent={(r) => r.day}
                                          />
                                        </TableBody>
                                      </Table>
                                    )}
                                  />
                                  <DataTableCell
                                    getContent={(r) => (
                                      <Table data={[r]} isNested={true}>
                                        <TableBody
                                          fontSize={10}
                                          textAlign={"right"}
                                          includeTopBorder={false}
                                          includeBottomBorder={false}
                                          includeLeftBorder={false}
                                          includeRightBorder={false}
                                        >
                                          <DataTableCell
                                            getContent={(r) => (
                                              <Text style={{ marginRight: 1 }}>
                                                {r.inTime1}
                                              </Text>
                                            )}
                                          />
                                          <DataTableCell
                                            getContent={(r) => (
                                              <Text style={{ marginRight: 1 }}>
                                                {r.outTime1}
                                              </Text>
                                            )}
                                          />
                                        </TableBody>
                                      </Table>
                                    )}
                                  />
                                  <DataTableCell
                                    getContent={(r) => (
                                      <Table data={[r]} isNested={true}>
                                        <TableBody
                                          fontSize={10}
                                          textAlign={"right"}
                                          includeTopBorder={false}
                                          includeBottomBorder={false}
                                          includeLeftBorder={false}
                                          includeRightBorder={false}
                                        >
                                          <DataTableCell
                                            getContent={(r) => (
                                              <Text style={{ marginRight: 1 }}>
                                                {r.inTime2}
                                              </Text>
                                            )}
                                          />
                                          <DataTableCell
                                            getContent={(r) => (
                                              <Text style={{ marginRight: 1 }}>
                                                {r.outTime2}
                                              </Text>
                                            )}
                                          />
                                        </TableBody>
                                      </Table>
                                    )}
                                  />

                                  <DataTableCell
                                    getContent={(r) => (
                                      <Table data={[r]} isNested={true}>
                                        <TableBody
                                          fontSize={10}
                                          textAlign={"right"}
                                          includeTopBorder={false}
                                          includeBottomBorder={false}
                                          includeLeftBorder={false}
                                          includeRightBorder={false}
                                        >
                                          <DataTableCell
                                            getContent={(r) => (
                                              <Text style={{ marginRight: 1 }}>
                                                {r.undertime}
                                              </Text>
                                            )}
                                          />
                                        </TableBody>
                                      </Table>
                                    )}
                                  />
                                </TableBody>
                              </Table>
                              <view
                                style={{
                                  fontSize: 10,
                                  borderLeft: "1px solid black",
                                  borderRight: "1px solid black",
                                  borderBottom: "1px solid black",
                                  flexDirection: "row",
                                }}
                              >
                                <View
                                  style={{
                                    textAlign: "right",
                                    width: 177,
                                    borderRight: "1px solid black",
                                  }}
                                >
                                  <Text style={{ marginRight: 1 }}>
                                    Total Undertime
                                  </Text>
                                </View>

                                <View style={{ textAlign: "right", width: 58 }}>
                                  <Text style={{ marginRight: 1 }}>0</Text>
                                </View>
                              </view>
                            </View>

                            <Text style={{ fontSize: 10, marginTop: 30 }}>
                              I certify on my honor that the above is a true and
                              correct report of the hours of work performed,
                              record of which was made daily at the time of
                              arrival and departure from office.
                            </Text>
                            {/* Horizontal Line */}
                            <View
                              style={{
                                ...styles.line,
                                marginTop: 40,
                                marginBottom: 15,
                              }}
                            />
                            <Text style={{ fontSize: 10, textAlign: "center" }}>
                              Verified as to the prescribed office hours
                            </Text>
                            <View
                              style={{
                                ...styles.line,
                                marginTop: 40,
                                marginBottom: 15,
                              }}
                            />
                            <View
                              style={{
                                ...styles.line,
                                marginTop: 25,
                                borderBottomWidth: 1,
                              }}
                            />
                          </view>
                        </View>
                      </Page>
                    ))}
                  </Document>
                </PDFViewer>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const dropzoneStyle = {
  border: "4px dashed blue",
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};
export default App;
