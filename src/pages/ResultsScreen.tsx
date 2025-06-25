import React, { useState } from "react";
import { Scale, ArrowRight, Copy, QrCode, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionButton from "../components/button/ActionButton";
import Modal from "../components/Modal";
import { vietnameseBanks } from "../constants/vietnameseBanks";
import type { Participant, Transaction, Expense } from "../types";

type ResultsScreenProps = {
  expenses: Expense[];
  transactions: Transaction[];
  participants: Participant[];
  hasCalculated: boolean;
  calculateSplit: () => void;
  addToast: (message: string) => void;
};

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  expenses,
  transactions,
  participants,
  hasCalculated,
  calculateSplit,
  addToast,
}) => {
  const { t: translate } = useTranslation();

  const [qrModal, setQrModal] = useState<{
    open: boolean;
    acc?: string;
    bank?: string;
    amount?: number;
    name?: string;
  }>({ open: false });

  const [transferred, setTransferred] = useState<Record<number, boolean>>({});

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast("successCopy");
    });
  };

  const openQrModal = (
    acc: string,
    bank: string,
    amount: number,
    name: string
  ) => {
    setQrModal({ open: true, acc, bank, amount, name });
  };

  const closeQrModal = () => setQrModal({ open: false });

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        {translate("resultTitle")}
      </h2>

      <ActionButton
        onClick={calculateSplit}
        disabled={participants.length < 2 || expenses.length === 0}
      >
        <Scale className="mr-2" size={20} /> {translate("calculate")}
      </ActionButton>

      {hasCalculated && (
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-center text-green-700 bg-green-100 p-4 rounded-lg font-medium">
              {translate("resultAllSettled", "Mọi chi phí đã được giải quyết công bằng!")}
            </p>
          ) : (
            [...transactions.entries()]
              .sort((a, b) => {
                const [iA] = a,
                  [iB] = b;
                const tA = transferred[iA] ? 1 : 0;
                const tB = transferred[iB] ? 1 : 0;
                return tA - tB;
              })
              .map(([i, t]) => {
                const from = participants.find((p) => p.id === t.from);
                const to = participants.find((p) => p.id === t.to);

                if (!from || !to) return null;

                const bankName =
                  vietnameseBanks.find((b) => b.code === to.bank)?.name ||
                  to.bank;

                return (
                  <div
                    key={i}
                    className={`bg-indigo-50 rounded-xl p-4 shadow-sm animate-fade-in ${
                      transferred[i] ? "opacity-70" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap">
                      <span className="font-bold text-indigo-800 text-base">
                        {from.name}
                      </span>
                      <ArrowRight className="text-gray-500 mx-2" />
                      <span className="font-bold text-indigo-800 text-base">
                        {to.name}
                      </span>
                      <span className="ml-auto text-lg font-bold text-green-600">
                        {t.amount.toLocaleString("vi-VN")}₫
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-indigo-100 text-sm">
                      <p className="font-semibold">
                        {translate("receiveInfo", { name: to.name })}
                      </p>

                      <div className="flex justify-between items-center mt-1 gap-2">
                        <div className="truncate text-gray-700 max-w-[70%]">
                          <p>{bankName}</p>
                          <p>{translate("bankNumber")}: {to.accountNumber}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(to.accountNumber)}
                          className="flex-shrink-0 flex items-center text-sky-600 hover:text-sky-800 font-medium text-xs px-2 py-1 border border-sky-100 rounded"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          <Copy size={14} className="mr-1" /> {translate("copy")}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className="bg-gray-200 text-center text-gray-500 text-xs py-2 rounded-md cursor-pointer hover:bg-gray-300 flex items-center justify-center gap-2 flex-1"
                          onClick={() =>
                            openQrModal(to.accountNumber, to.bank, t.amount, to.name)
                          }
                          title={translate("showQrTitle")}
                        >
                          <QrCode size={16} className="mr-1" />{" "}
                          {translate("viewQr")}
                        </div>
                        <button
                          className={`border border-gray-300 rounded px-2 py-1 text-xs flex items-center gap-1 transition-colors ${
                            transferred[i]
                              ? "bg-green-100 text-green-700 border-green-300"
                              : "bg-white text-gray-500 hover:bg-gray-100"
                          }`}
                          style={{ minWidth: 80, fontWeight: 500 }}
                          onClick={() =>
                            setTransferred((prev) => ({ ...prev, [i]: !prev[i] }))
                          }
                          disabled={transferred[i]}
                          title={translate("markAsTransferred")}
                        >
                          {transferred[i] ? <Check size={14} /> : null}
                          {transferred[i] ? translate("transferred") : translate("markTransferred")}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      <Modal
        isOpen={qrModal.open}
        onClose={closeQrModal}
        titleKey="qrTitle"
      >
        {qrModal.open && (
          <div className="flex flex-col items-center gap-3">
            <img
              src={`https://qr.sepay.vn/img?acc=${qrModal.acc}&bank=${qrModal.bank}&amount=${qrModal.amount}&des=Thanh%20toan%20cho%20${encodeURIComponent(
                qrModal.name || ""
              )}&template=qronly`}
              alt={translate("qrTitle")}
              className="w-56 h-56 object-contain border rounded-lg bg-white"
            />
            <div className="text-xs text-gray-600 text-center">
              {translate("qrDesc")}
              <br />
              <span className="font-semibold">{translate("qrNote")}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
