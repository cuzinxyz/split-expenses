import React, { useState, useMemo, useEffect } from "react";
import { Plus, Eraser, Trash2, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionButton from "../components/button/ActionButton";
import InputWithLabel from "../components/input/InputWithLabel";
import CurrencyInput from "../components/input/CurrencyInput";
import SearchableSelect from "../components/selectbox/SearchableSelect";
import CustomCheckbox from "../components/checkbox/CustomCheckbox";
import Modal from "../components/Modal";
import type { Expense, Participant } from "../types";

type ExpenseScreenProps = {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  participants: Participant[];
  addToast: (message: string) => void;
  openModal: (modalName: string) => void;
};

export const ExpenseScreen: React.FC<ExpenseScreenProps> = ({
  expenses,
  setExpenses,
  participants,
  addToast,
  openModal,
}) => {
  const { t, i18n } = useTranslation();
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [paidBy, setPaidBy] = useState<string>("");
  const [splitAmong, setSplitAmong] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "addParticipant" | "confirmClearExpenses" | null;
  }>({
    isOpen: false,
    type: null,
  });

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, exp) => sum + exp.amount, 0),
    [expenses]
  );

  useEffect(() => {
    if (participants.length > 0) {
      if (!paidBy || !participants.find((p) => p.id === paidBy)) {
        setPaidBy(participants[0].id);
      }
      setSplitAmong(participants.map((p) => p.id));
    } else {
      setPaidBy("");
      setSplitAmong([]);
    }
  }, [participants, paidBy]);

  const handleAddExpense = async () => {
    if (!description || amount <= 0 || !paidBy || splitAmong.length === 0) {
      addToast(t("pleaseFillAllFields"));
      return;
    }
    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount,
      paidBy,
      splitAmong,
    };
    setExpenses((prev) => [...prev, newExpense]);
    addToast(t("expenseAddedSuccessfully"));
    resetForm();
  };

  const handleUpdateExpense = async () => {
    if (!editingId) return;
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === editingId
          ? { ...exp, description, amount, paidBy, splitAmong }
          : exp
      )
    );
    addToast(t("expenseUpdatedSuccessfully"));
    resetForm();
  };

  const handleEditClick = (exp: Expense) => {
    setEditingId(exp.id);
    setDescription(exp.description);
    setAmount(exp.amount);
    setPaidBy(exp.paidBy);
    setSplitAmong(exp.splitAmong);
  };

  const resetForm = () => {
    setEditingId(null);
    setDescription("");
    setAmount(0);
    setPaidBy(participants[0]?.id || "");
    setSplitAmong(participants.map((p) => p.id));
  };

  const handleDeleteExpense = async (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    addToast(t("expenseDeletedSuccessfully"));
    if (editingId === id) resetForm();
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: null });
  };

  const renderModalContent = () => {
    switch (modalConfig.type) {
      case "addParticipant":
        return <div>{t("addParticipantContent")}</div>;
      case "confirmClearExpenses":
        return (
          <div>
            <p>{t("confirmClearExpenses")}</p>
            <div className="flex justify-end gap-2 mt-4">
              <ActionButton
                onClick={() => {
                  setExpenses([]);
                  addToast(t("allExpensesCleared"));
                  closeModal();
                }}
                variant="danger"
              >
                {t("yesClearAll")}
              </ActionButton>
              <ActionButton onClick={closeModal} variant="outline">
                {t("cancel")}
              </ActionButton>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-sky-200 rounded-xl p-4 text-center">
        <p className="text-sm text-sky-800 font-medium">{t("totalExpense")}</p>
        <p className="text-3xl font-bold text-sky-900">
          {new Intl.NumberFormat(i18n.language === "vi" ? "vi-VN" : "en-US").format(
            totalExpenses
          )}{" "}
          ₫
        </p>
      </div>

      <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-white">
        <InputWithLabel
          id="desc"
          label={t('expenseDescription')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <CurrencyInput
          id="amount"
          label={t('amount')}
          value={amount}
          onValueChange={setAmount}
        />

        <SearchableSelect
          options={participants}
          value={paidBy}
          onChange={setPaidBy}
          placeholder={t('payer')}
        />

        <div>
          <label className="text-sm font-semibold text-gray-600">
            {t('splitAmong')}
          </label>
          <div className="mt-2 space-y-3 max-h-32 overflow-y-auto custom-scrollbar pr-2">
            {participants.map((p) => (
              <CustomCheckbox
                key={p.id}
                id={`split-${p.id}`}
                checked={splitAmong.includes(p.id)}
                onChange={() =>
                  setSplitAmong((prev) =>
                    prev.includes(p.id)
                      ? prev.filter((id) => id !== p.id)
                      : [...prev, p.id]
                  )
                }
                label={p.name}
              />
            ))}
          </div>
        </div>
        {editingId ? (
          <div className="flex gap-2">
            <ActionButton onClick={handleUpdateExpense}>
              <Save className="mr-2" size={20} /> {t('save')}
            </ActionButton>
            <ActionButton onClick={resetForm} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
              <X className="mr-2" size={20} /> {t('cancel')}
            </ActionButton>
          </div>
        ) : (
          <ActionButton onClick={handleAddExpense} disabled={participants.length === 0}>
            <Plus className="mr-2" size={20} /> {t('addExpense')}
          </ActionButton>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-700">{t('expenseList')}</h3>
          {expenses.length > 0 && (
            <button
              onClick={() => setModalConfig({ isOpen: true, type: "confirmClearExpenses" })}
              className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium"
            >
              <Eraser size={16} className="mr-1" /> {t('clearAll')}
            </button>
          )}
        </div>
        {expenses.map((exp) => {
          const payer = participants.find((p) => p.id === exp.paidBy);
          return (
            <div
              key={exp.id}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 animate-fade-in flex justify-between items-start cursor-pointer"
              onClick={() => handleEditClick(exp)}
              title={t('edit')}
            >
              <div>
                <p className="font-semibold text-base">{exp.description}</p>
                <p className="text-sm text-gray-600">
                  {exp.amount.toLocaleString(i18n.language === 'vi' ? 'vi-VN' : 'en-US')}₫ {t('paidBy')} {payer ? payer.name : 'N/A'}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteExpense(exp.id);
                }}
                className="text-red-500 hover:text-red-700"
                title={t('delete')}
              >
                <Trash2 size={20} />
              </button>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        titleKey={modalConfig.type === "addParticipant" ? "addParticipantTitle" : "confirmTitle"}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};
