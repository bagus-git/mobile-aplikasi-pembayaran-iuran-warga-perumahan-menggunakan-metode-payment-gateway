import { ExpoConfig } from "expo/config";

export interface People {
  phoneNumber: string;
  email: string;
  houseNumber: string;
  idNumber?: string;
  name: string;
  password?: string;
  roadBlock: string;
  status?: boolean;
  tagihan?: TagihanKey;
  pembayaran?: PembayaranKey;
}

export interface InitModel {
  isFreshInstall: boolean;
  isLogin: boolean;
}
interface PembayaranKey {
  [key: string]: string;
}

interface TagihanKey {
  [key: string]: Tagihan;
}

interface Tagihan {
  bill: string;
  cost: string;
}

export interface PaymentState {
  paymentMethod: BankType;
}

export type BankType =
  | "BANK BRI"
  | "BANK BNI"
  | "BANK BCA"
  | "BANK MANDIRI"
  | "";

type TransacactionBankType = "bca" | "bni" | "bri" | "mandiri";

export interface BankMap {
  key: TransacactionBankType;
  value: BankType;
}

export interface TransactionPayloadModel {
  payment_type: string;
  transaction_details: Transactiondetails;
  bank_transfer?: Banktransfer;
  echannel?: Echannel;
}

interface Banktransfer {
  bank: TransacactionBankType;
}

interface Transactiondetails {
  order_id: string;
  gross_amount: number;
}

interface Echannel {
  bill_info1: string;
  bill_info2: string;
}

export interface PaymentResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  currency: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  va_numbers: Vanumber[];
  fraud_status: string;
  bill_key: string;
  biller_code: string;
}

interface Vanumber {
  bank: TransacactionBankType;
  va_number: string;
}

export interface PaymentModel {
  transactionTime: string;
  status: string;
  warga: string;
  bank?: TransacactionBankType;
  vaNumber?: string;
  transactionAmount: string;
  periode: string;
  billKey?: string;
  billerCode?: string;
  orderId: string;
}

export interface StatusResponse {
  masked_card: string;
  approval_code: string;
  bank: string;
  eci: string;
  channel_response_code: string;
  channel_response_message: string;
  transaction_time: string;
  gross_amount: string;
  currency: string;
  order_id: string;
  payment_type: string;
  signature_key: string;
  status_code: string;
  transaction_id: string;
  transaction_status: string;
  fraud_status: string;
  settlement_time: string;
  status_message: string;
  merchant_id: string;
  card_type: string;
  three_ds_version: string;
  challenge_completion: boolean;
}
