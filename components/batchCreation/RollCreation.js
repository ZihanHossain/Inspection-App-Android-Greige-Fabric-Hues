import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import SelectDropdownCustom from "../SelectDropdownCustom";
import { Table, Row, Rows } from "react-native-table-component";

export default function RollCreation() {
  const [batches, setBatches] = useState([]);
  const [bNumber, setBNumber] = React.useState("");
  const [rollNumWeight, setRollNumWeight] = useState([]);
  const [prevRollNumWeight, setPrevRollNumWeight] = useState([]);
  const [rollNumber, setRollNumber] = useState("");
  const [tableHead, setTableHead] = useState(["Roll Number"]);
  const [selectedItem, setSelectedItem] = useState(null);

  const getBatchs = async (text) => {
    try {
      const response = await fetch(
        `http://${global.SERVERID}/inspaction/get_batches`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber: text,
          }),
        }
      );
      const json = await response.json();
      const arr = [];
      json.forEach((element) => {
        arr.push({ id: element.Id, item: element.WorkOrderId });
      });
      setBatches(arr);
    } catch (error) {
      console.error(error);
    }
  };

  const getPrevRollsByBatchNo = async (bNumber) => {
    try {
      const response = await fetch(
        `http://${global.SERVERID}/inspaction/get_rolls_by_bNumber_for_add_roll`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber,
          }),
        }
      );
      const json = await response.json();
      const arr = [];
      json.forEach((element) => {
        arr.push([element.roll_number]);
      });
      setPrevRollNumWeight(arr);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // getBatch();
  }, []);

  const AlertButton = (msg) => Alert.alert("Warning", msg, [{ text: "OK" }]);

  const saveRoll = async () => {
    try {
      const response = await fetch(
        `http://${global.SERVERID}/inspaction/add_batch_roll`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roll_num_weight: rollNumWeight,
            bNumber: bNumber,
          }),
        }
      );
      const json = await response.json();
      if (json.rowsAffected > 0) {
        setRollNumber(""),
          setRollNumWeight([]),
          getPrevRollsByBatchNo(bNumber),
          AlertButton("Rolls Saved Successfully!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addRoll = () => {
    if (bNumber.length === 0) {
      AlertButton("Please select a Batch");
    } else if (rollNumber.length === 0) {
      AlertButton("Please enter Roll Number");
    } else {
      let rollFound = false;
      if (prevRollNumWeight.length > 0) {
        prevRollNumWeight.forEach((element) => {
          if (element[0] === rollNumber) {
            AlertButton(`Roll Number ${rollNumber} in already added!`);
            rollFound = true;
          }
        });
      }
      if (!rollFound) {
        if (rollNumWeight.length > 0) {
          rollNumWeight.forEach((element) => {
            if (element[0] === rollNumber) {
              AlertButton(`Roll Number ${rollNumber} is already added!`);
              rollFound = true;
            }
          });
        }
      }
      if (!rollFound) {
        setRollNumWeight([...rollNumWeight, [rollNumber]]);
        //Roll Weight was removed because of management request, but database is still function with roll weight
        //setRollNumWeight([...rollNumWeight, [rollNumber, rollWeight]]);
        setRollNumber("");
      }
    }
  };

  const handleSelect = (item) => {
    setSelectedItem(item.item);
    setBNumber(item.item);
    getPrevRollsByBatchNo(item.item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.app}>
        <View style={styles.dropdownContainer}>
          <SelectDropdownCustom
            data={batches}
            onSelect={handleSelect}
            onSearch={getBatchs}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rollCol}>
            <Text>Roll Number</Text>
            <TextInput
              placeholder="Roll Number"
              keyboardType="numeric"
              style={styles.input}
              value={rollNumber}
              onChangeText={(val) => setRollNumber(val)}
            />
          </View>
        </View>
        <Button title="      Add      " onPress={addRoll}></Button>
        <TouchableOpacity style={styles.button} onPress={saveRoll}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <View style={styles.tables}>
          <View style={styles.table}>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.legends}>Add Roles</Text>
            </View>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                <Row
                  data={tableHead}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <Rows data={rollNumWeight} textStyle={styles.text} />
              </Table>
            </ScrollView>
          </View>
          <View style={styles.table}>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.legends}>Saved Rolls</Text>
            </View>
            <ScrollView style={styles.dataWrapper}>
              <Table
                borderStyle={{
                  borderWidth: 2,
                  borderColor: "#c8e1ff",
                }}
              >
                <Row
                  data={tableHead}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <Rows data={prevRollNumWeight} textStyle={styles.text} />
              </Table>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    padding: 20,
  },
  app: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: "100%",
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
  },
  col1: {
    flex: 1,
    marginRight: 20,
  },
  rollCol: {
    flex: 1,
    marginRight: "60%",
  },
  legends: {
    fontSize: 25,
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    paddingLeft: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6200EE",
    padding: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    updateButton: {
      marginLeft: 100,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tables: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    maxHeight: "60%",
    paddingBottom: "5%",
  },
  table: {
    width: "48%",
    borderColor: "black",
    // backgroundColor: "green",
    borderRadius: 10,
  },
  head: {
    height: 50,
    backgroundColor: "#f1f8ff",
  },
  text: {
    margin: 6,
  },
  dropdownContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: "2%",
  },
  selectedItemContainer: {
    marginTop: 16,
  },
  selectedItemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
