import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ToastAndroid,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function RollQtyCom({
  batch,
  rollId,
  Qty,
  number,
  rejectStatus,
}) {
  const [rollQty, setRollQty] = useState(Qty);
  const [reject, setReject] = useState(rejectStatus);

  function showToast(suc, roll) {
    if (suc) {
      ToastAndroid.show(
        `Roll: ${roll} updated successfully!`,
        ToastAndroid.SHORT
      );
    } else {
      ToastAndroid.show(`Roll: ${roll} updated Failed!`, ToastAndroid.SHORT);
    }
  }

  function showToastError() {
    ToastAndroid.show(`Qty is less than 1!`, ToastAndroid.SHORT);
  }

  const saveRollQty = async () => {
    if (rollQty === null || rollQty < 1) {
      showToastError();
    } else {
      try {
        const response = await fetch(
          `http://${global.SERVERID}/inspaction/save_greige_roll_qty`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              batchNumebr: batch,
              id: rollId,
              rollNumber: number,
              rollQty,
              reject: reject ? 1 : 0,
            }),
          }
        );

        const json = await response.json();

        showToast(json, number);
        console.log(json);
      } catch (err) {}
    }
  };
  return (
    <View style={styles.tableBodyRow}>
      <View style={styles.tableBodyCol}>
        <Text>{number}</Text>
      </View>
      <View style={styles.tableBodyCol}>
        <TextInput
          keyboardType="numeric"
          placeholder="Qty"
          value={rollQty ? rollQty.toString() : ""}
          onChangeText={(text) => {
            setRollQty(
              text.trim() === "" || parseFloat(text) < 0
                ? null
                : parseFloat(text)
            );
            console.log(rollQty);
          }}
        />
      </View>
      <View style={styles.tableBodyCol}>
        <BouncyCheckbox
          size={30}
          fillColor="red"
          unfillColor="#FFFFFF"
          text="reject"
          textStyle={{
            textDecorationLine: "none",
          }}
          disabled={rollQty === null ? true : false}
          isChecked={reject}
          onPress={() => {
            setReject(!reject);
          }}
        />
      </View>
      <View style={{ ...styles.tableBodyCol, ...styles.saveButton }}>
        <Pressable onPress={saveRollQty}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  saveButton: {
    borderRadius: 5,
    paddingVertical: 5,
    marginVertical: 12,
    backgroundColor: "#2196F3",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
});
