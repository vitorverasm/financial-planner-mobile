import { z } from "zod";
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { readString } from 'react-native-csv'

const c6BankAttributeMapper: Record<string, string> = {
    "Cotação (em R$)": "usdQuotation",
    "Data de Compra": "purchasedAt",
    "Descrição": "description",
    "Final do Cartão": "cardLastDigits",
    "Nome no Cartão": "cardHolderName",
    "Parcela": "installment",
    "Valor (em R$)": "amount",
    "Valor (em US$)": "amountInUsd",
    "Categoria": "category",
}


export const C6BankRecordSchema = z.object({
    purchasedAt: z.string(),
    cardHolderName: z.string(),
    cardLastDigits: z.string(),
    category: z.string(),
    description: z.string(),
    installment: z.string(),
    amountInUsd: z.string(),
    usdQuotation: z.string(),
    amount: z.string(),
});

export type C6BankRecord = z.infer<typeof C6BankRecordSchema>;

export const processCsvFile = async () => {
    const document = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true, type: "text/csv"
    })
    if (document.assets) {
        const records: C6BankRecord[] = []
        const fileUri = document.assets[0].uri
        const content = await FileSystem.readAsStringAsync(fileUri)
        readString(content, {
            delimiter: ';',
            header: true,
            transformHeader: (headerName: string) => {
                return c6BankAttributeMapper[headerName]
            },
            step: (results: any) => {
                const bankRecord = C6BankRecordSchema.safeParse(results.data)
                if (bankRecord.success) {
                    records.push(bankRecord.data);
                }
            },
            skipEmptyLines: true
        })
        return records
    }

}
