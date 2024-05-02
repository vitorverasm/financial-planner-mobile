import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { C6BankRecord, processCsvFile } from "./src/file-processor";
import { useCallback, useState } from "react";

export default function App() {
  const [bankRecords, setBankRecords] = useState<C6BankRecord[]>();

  const processFile = useCallback(async () => {
    try {
      const records = await processCsvFile();
      if (records) {
        setBankRecords(records);
      }
    } catch (error) {
      console.log("Error reading csv: ", error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      {!bankRecords ? (
        <TouchableOpacity
          onPress={processFile}
          style={{
            padding: 16,
            backgroundColor: "#333",
            borderRadius: 6,
            marginTop: 32,
          }}
        >
          <Text style={{ color: "white" }}>Pick document</Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={bankRecords}
          renderItem={({ item }) => {
            return (
              <View style={{ flexDirection: "row" }}>
                <Text>{item.description}</Text>
                <Text>{item.amount}</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
