import React, { useEffect, useState } from "react";
// import * as Print from 'expo-print';
// import { shareAsync } from 'expo-sharing';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
  Keyboard,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SelectDropdownCustom from "./SelectDropdownCustom";

export default function PrintScreen() {
  const [name, setName] = useState("");
  const [po, setPo] = useState(0);
  const [bNumber, setBNumber] = useState("");
  const [fabrication, setFabrication] = useState("");
  const [color, setColor] = useState("");
  const [gsm, setGsm] = useState(0);
  const [aclWidth, setAclWidth] = useState("NA");
  const [machineNumber, setMachineNumber] = useState(0);
  const [rollWeight, setRollWeight] = useState(0);
  const [rolls, setRolls] = useState("");
  const [rNumber, setRNumber] = useState("");
  const [date, setDate] = useState();
  const [userid, setUserId] = useState();
  const [rollLength, setRollLength] = React.useState(0);
  const [batches, setBatches] = React.useState([]);
  const [inventoryCode, setInventoryCode] = React.useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  let now = new Date().toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const getBatchs = async (text) => {
    try {
      const response = await fetch(
        `http://${global.SERVERID}/inspaction/get_batches_for_print`,
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

  useEffect(() => {
    // getBatchs();
  }, []);

  const getRoll = async (selectedItem) => {
    try {
      const response = await fetch(
        `http://${global.SERVERID}/inspaction/get_roll_by_batch_no_for_print`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber: selectedItem,
          }),
        }
      );
      const json = await response.json();
      const arr = [];
      const arr1 = [];
      json.forEach((element) => {
        arr.push(element.roll_number);
        arr1.push(element.id);
      });
      setRolls(arr);
      setRNumber("");
    } catch (error) {
      console.error(error);
    }
  };

  function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  const getData = async (rno) => {
    try {
      const response = await fetch(
        `http://${global.SERVERID}/inspaction/get_data_by_batch_roll_no`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber,
            roll_number: rno,
          }),
        }
      );
      const json = await response.json();
      setName(json[0]["customer"]);
      setFabrication(json[0]["fabricname"]);
      setColor(json[0]["shade"]);
      setGsm(json[0]["GSM"]);
      setPo(json[0]["WFX_PO"]);
      setMachineNumber(json[0]["machine_number"]);
      setRollWeight(json[0]["ActualRollWeight"]);
      setAclWidth(json[0]["ActualRollWidth"]);
      setInventoryCode(json[0]["InventoryCode"]);
      setDate(json[0]["Date"]);
      setUserId(json[0]["user_id"]);
      setRollLength(
        round(
          (json[0]["ActualRollWeight"] * 39.37 * 1000) /
            (json[0]["GSM"] * json[0]["ActualRollWidth"]),
          2
        ).toFixed(2)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const AlertButton = (type, msg) =>
    Alert.alert(type === "w" ? "Successful" : "Warning", msg, [{ text: "OK" }]);

  const print = async () => {
    if (bNumber.length < 1) {
      AlertButton("w", "Select Batch Number");
    } else if (rNumber.length < 1) {
      AlertButton("w", "Select Roll Number");
    } else if (gsm === 0) {
      AlertButton("w", "No GSM for this Roll");
    } else {
      try {
        const response = await fetch("http://10.12.3.182:8002/rest/print", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            printer: "a104ba2c76024f7597ceb1b31058306f",
            label: "7618c7e07031461dba57200230cf756a",
            data: {
              buyer: name,
              po: po,
              batch: bNumber,
              bar: bNumber + " ; roll:" + rNumber,
              fabrication,
              color,
              rNumber,
              gsm,
              aclWidth,
              rollWeight,
              rollLength,
              inventoryCode,
              USERID: userid,
              date: date.toString(),
            },
          }),
        });
        const json = await response.json();
        if (json["failed"] === true) {
          AlertButton("w", "Sticker Print Failed");
          console.log(json);
        } else {
          AlertButton("s", "Sticker Print Successfil");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setBNumber(item.item);
    getRoll(item.item);
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
          <View style={styles.col1}>
            <Text>Roll Number</Text>
            <SelectDropdown
              data={rolls}
              onSelect={(selectedItem, index) => {
                getData(selectedItem);
                setRNumber(selectedItem);
              }}
              defaultButtonText={"Select Roll No."}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={styles.input1}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              renderDropdownIcon={(isOpened) => {
                return (
                  <FontAwesome
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    color={"#444"}
                    size={18}
                  />
                );
              }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
              selectedRowStyle={styles.dropdown1SelectedRowStyle}
            />
          </View>
          <View style={styles.col1}>
            <Text>Machine Number</Text>
            <TextInput
              editable={false}
              placeholder="Machine Number"
              style={styles.input1}
              value={machineNumber.toString()}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col1}>
            <Text>Buyer</Text>
            <TextInput
              editable={false}
              placeholder="Buyer"
              style={styles.input1}
              value={name}
            />
          </View>
          <View style={styles.col1}>
            <Text>Customer PO</Text>
            <TextInput
              editable={false}
              placeholder="Buyer"
              style={styles.input1}
              value={po}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col1}>
            <Text>Fabric Composition</Text>
            <TextInput
              editable={false}
              placeholder="Fabrication"
              value={fabrication}
              style={styles.input1}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col1}>
            <Text>Color</Text>
            <TextInput
              editable={false}
              placeholder="Color"
              value={color}
              style={styles.input1}
            />
          </View>
          <View style={styles.col1}>
            <Text>Actual Weight (KG)</Text>
            <TextInput
              editable={false}
              placeholder="Actual Weight (KG)"
              value={rollWeight.toString()}
              style={styles.input1}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col1}>
            <Text>Actual Width (INCH)</Text>
            <TextInput
              editable={false}
              placeholder="Req. Width (INCH)"
              style={styles.input1}
              value={aclWidth.toString()}
            />
          </View>
          <View style={styles.col1}>
            <Text>Actual GSM</Text>
            <TextInput
              editable={false}
              placeholder="Req. GSM"
              style={styles.input1}
              value={gsm.toString()}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col1}>
            <Text>Inspactor Id</Text>
            <TextInput
              editable={false}
              placeholder="Inspactor Id"
              style={styles.input1}
              value={userid}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={print}>
        <Text style={styles.buttonText}>Print</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    width: "100%",
    marginVertical: 12,
    borderWidth: 1,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  input1: {
    height: 40,
    width: "100%",
    marginVertical: 12,
    borderWidth: 1,
    paddingHorizontal: 20,
    fontWeight: "bold",
    color: "green",
    borderRadius: 10,
  },
  app: {
    flex: 1,
    marginHorizontal: "auto",
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#00b894",
    alignItems: "center",
    marginBottom: 40,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 12,
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
  },
  col1: {
    backgroundColor: "#FCE0E0",
    borderColor: "#fff",
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  col2: {
    backgroundColor: "#00b894",
    borderColor: "#fff",
    borderWidth: 1,
    flex: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  "3col": {
    backgroundColor: "#fbc531",
    borderColor: "#fff",
    borderWidth: 1,
    flex: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  "4col": {
    flex: 4,
  },
  dropdown1DropdownStyle: {
    backgroundColor: "white",
    borderRadius: 25,
  },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: {
    color: "#444",
    textAlign: "left",
  },
  dropdown1SelectedRowStyle: {
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 25,
  },
  dropdown1searchInputStyleStyle: {
    backgroundColor: "#EFEFEF",
    borderRadius: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  dropdownContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: "3%",
    marginBottom: "2%",
  },
  selectedItemContainer: {
    marginBottom: "2%",
  },
  selectedItemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
