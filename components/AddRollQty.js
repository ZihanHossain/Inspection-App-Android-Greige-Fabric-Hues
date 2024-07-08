import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import SelectDropdownCustom from "./SelectDropdownCustom";
// import { TextInput } from "react-native-paper";
// import BouncyCheckbox from "react-native-bouncy-checkbox";
// import { Entypo } from "@expo/vector-icons";
import RollQtyCom from "./RollQtyCom";

export default function AddRollQty() {
  const [rolls, setRolls] = useState([]);
  const [batches, setBatches] = React.useState([]);
  const [batch, setBNumber] = useState("");
  //   const [rollQty, setRollQty] = useState({});

  const getBatchs = async (item) => {
    try {
      const response = await fetch(
        `http://${global.SERVERID}/inspaction/get_saved_greige_batches`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber: item,
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

  const getRolls = async (bNumber) => {
    try {
      const response = await fetch(
        `http://${global.SERVERID}/inspaction/get_roll_by_batch_no_for_greige_roll_qty`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber: bNumber,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const json = await response.json();
      if (json.length > 0) {
        setRolls(json);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelect = (item) => {
    // setSelectedItem(item);
    setBNumber(item.item);
    getRolls(item.item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.app}>
        <View style={styles.topSection}>
          <View style={styles.dropdownContainer}>
            <View>
              <Text>Batch Number:</Text>
            </View>
            <SelectDropdownCustom
              data={batches}
              onSelect={handleSelect}
              onSearch={getBatchs}
            />
          </View>
          {/* {selectedItem && (
            <View style={styles.selectedItemContainer}>
              <Text style={styles.selectedItemText}>
                Selected Item: {selectedItem.item}
              </Text>
            </View>
          )} */}
        </View>
        <View style={styles.bottomSection}>
          <View style={styles.table}>
            <View style={styles.tableHead}>
              <Text>Roll Number</Text>
            </View>
            <ScrollView>
              <View style={styles.tableBody}>
                {rolls.map((row) => {
                  return (
                    <RollQtyCom
                      batch={batch}
                      rollId={row.id}
                      Qty={row.ActualRollWeight}
                      number={row.roll_number}
                      rejectStatus={row.reject}
                    />
                    // <View style={styles.tableBodyRow}>
                    //   <View style={styles.tableBodyCol}>
                    //     <Text>{row.roll_number}</Text>
                    //   </View>
                    //   <View style={styles.tableBodyCol}>
                    //     <TextInput
                    //       keyboardType="numeric"
                    //       placeholder="Qty"
                    //       onChangeText={(text) => {
                    //         if (text.length < 1) {
                    //           const updateRollQty = rollQty;

                    //           delete updateRollQty[row.id];
                    //           setRollQty(updateRollQty);
                    //         } else {
                    //           const updateRollQty = {
                    //             ...rollQty,
                    //             [row.id]: {
                    //               ...rollQty[row.id],
                    //               ActualRollWeight:
                    //                 text.trim() === "" || parseFloat(text) < 0
                    //                   ? null
                    //                   : parseFloat(text),
                    //             },
                    //           };
                    //           setRollQty(updateRollQty);
                    //           console.log(rollQty);
                    //         }
                    //         console.log(rollQty);
                    //       }}
                    //     />
                    //   </View>
                    //   <View style={styles.tableBodyCol}>
                    //     <BouncyCheckbox
                    //       size={30}
                    //       fillColor="red"
                    //       unfillColor="#FFFFFF"
                    //       text="reject"
                    //       textStyle={{
                    //         textDecorationLine: "none",
                    //       }}
                    //       disabled={
                    //         rollQty[row.id] &&
                    //         rollQty[row.id].hasOwnProperty("ActualRollWeight")
                    //           ? false
                    //           : true
                    //       }
                    //       isChecked={
                    //         rollQty[row.id] &&
                    //         rollQty[row.id].hasOwnProperty("reject")
                    //           ? rollQty[row.id].reject
                    //           : false
                    //       }
                    //       onPress={() => {
                    //         const updateRejectRoll = {
                    //           ...rollQty,
                    //           [row.id]: {
                    //             ...rollQty[row.id],
                    //             reject:
                    //               rollQty[row.id] &&
                    //               rollQty[row.id].hasOwnProperty("reject")
                    //                 ? !rollQty[row.id].reject
                    //                 : true,
                    //           },
                    //         };
                    //         setRollQty(updateRejectRoll);
                    //       }}
                    //     />
                    //   </View>
                    // </View>
                  );
                })}
              </View>
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
    padding: 10,
    backgroundColor: "#fff",
  },
  app: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  topSection: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  bottomSection: {
    flex: 1,
    padding: 10,
  },
  dropdownContainer: {
    width: "100%",
    overflow: "hidden",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tableBody: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tableBodyRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
    paddingVertical: 5,
  },
  tableBodyCol: {
    flex: 1,
    alignItems: "center",
  },
});
