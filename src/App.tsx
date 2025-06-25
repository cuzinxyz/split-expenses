import {
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Users,
  DollarSign,
  Scale,
  Trash2
} from "lucide-react";
import ActionButton from './components/button/ActionButton'
import TabButton from "./components/button/TabButton";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import { ParticipantScreen } from "./pages/ParticipantScreen";
import { ExpenseScreen } from "./pages/ExpenseScreen";
import { ResultsScreen } from "./pages/ResultsScreen";
import { AddParticipantForm } from "./pages/AddParticipantForm";
import { initialParticipants } from "./constants/initialParticipants";
import { initialExpenses } from "./constants/initialExpenses";
import type { Participant, Expense, Transaction } from "./types";
import './i18n';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t, i18n } = useTranslation();
  const [participants, setParticipants] = useState<Participant[]>(
    () => JSON.parse(localStorage.getItem("participants")!) || initialParticipants
  );
  const [expenses, setExpenses] = useState<Expense[]>(
    () => JSON.parse(localStorage.getItem("expenses")!) || initialExpenses
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [activeTab, setActiveTab] = useState("participants");
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "",
    data: {},
  });
  const [toastConfig, setToastConfig] = useState({ show: false, message: "" });

  useEffect(() => {
    localStorage.setItem("participants", JSON.stringify(participants));
  }, [participants]);
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addToast = useCallback((message: string) => setToastConfig({ show: true, message: t(message) }), [t]);
  const openModal = (type: string, data = {}) => setModalConfig({ isOpen: true, type, data });
  const closeModal = () => setModalConfig({ isOpen: false, type: "", data: {} });

  const calculateSplit = useCallback(() => {
    const balances: Record<string, number> = participants.reduce(
      (acc, p) => ({ ...acc, [p.id]: 0 }),
      {}
    );
    expenses.forEach((expense) => {
      if (balances[expense.paidBy] !== undefined)
        balances[expense.paidBy] += expense.amount;
      if (expense.splitAmong.length > 0) {
        const splitValue = expense.amount / expense.splitAmong.length;
        expense.splitAmong.forEach((pId) => {
          if (balances[pId] !== undefined) balances[pId] -= splitValue;
        });
      }
    });
    const owers: { id: string; amount: number }[] = [],
      owed: { id: string; amount: number }[] = [];
    Object.entries(balances).forEach(([id, bal]) => {
      if (bal < 0) owers.push({ id, amount: -bal });
      else if (bal > 0) owed.push({ id, amount: bal });
    });
    const newTransactions: Transaction[] = [];
    let i = 0,
      j = 0;
    while (i < owers.length && j < owed.length) {
      const ower = owers[i],
        owedPerson = owed[j],
        amountToTransfer = Math.min(ower.amount, owedPerson.amount);
      if (amountToTransfer > 1) {
        newTransactions.push({
          from: ower.id,
          to: owedPerson.id,
          amount: amountToTransfer,
        });
        ower.amount -= amountToTransfer;
        owedPerson.amount -= amountToTransfer;
      }
      if (ower.amount < 1) i++;
      if (owedPerson.amount < 1) j++;
    }
    setTransactions(newTransactions);
    setHasCalculated(true);
    setActiveTab("results");
    addToast("successCalculate");
  }, [participants, expenses, addToast]);

  const renderModalContent = () => {
    switch (modalConfig.type) {
      case "addParticipant":
        return (
          <AddParticipantForm
            onAdd={(p) => setParticipants((prev) => [...prev, p])}
            onClose={closeModal}
            addToast={addToast}
          />
        );
      case "confirmClearAll":
        return (
          <div>
            <p className="text-gray-700 mb-4">
              {t('deleteAllConfirm')}
            </p>
            <div className="flex gap-4">
              <ActionButton
                onClick={closeModal}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                {t('cancel')}
              </ActionButton>
              <ActionButton
                onClick={() => {
                  setParticipants([]);
                  setExpenses([]);
                  setTransactions([]);
                  setHasCalculated(false);
                  addToast("successDeleteAll");
                  closeModal();
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                {t('confirmDelete')}
              </ActionButton>
            </div>
          </div>
        );
      case "confirmClearExpenses":
        return (
          <div>
            <p className="text-gray-700 mb-4">
              {t('deleteExpensesConfirm')}
            </p>
            <div className="flex gap-4">
              <ActionButton
                onClick={closeModal}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                {t('cancel')}
              </ActionButton>
              <ActionButton
                onClick={() => {
                  setExpenses([]);
                  addToast("successDeleteExpenses");
                  closeModal();
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                {t('confirmDelete')}
              </ActionButton>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-200 font-sans min-h-screen flex items-center justify-center">
      <div className="fixed top-4 left-4 z-50">
        <div className="flex items-center gap-2 bg-white/80 shadow-lg rounded-full px-3 py-1 border border-sky-200 backdrop-blur-sm">
          <span className="text-xs font-semibold text-sky-700 mr-1">🌐</span>
          <button
            onClick={() => i18n.changeLanguage('vi')}
            className={`px-2 py-1 rounded-full text-xs font-bold transition-all duration-200 ${i18n.language === 'vi' ? 'bg-sky-600 text-white shadow' : 'bg-white text-sky-700 hover:bg-sky-100'}`}
          >
            VI
          </button>
          <button
            onClick={() => i18n.changeLanguage('en')}
            className={`px-2 py-1 rounded-full text-xs font-bold transition-all duration-200 ${i18n.language === 'en' ? 'bg-sky-600 text-white shadow' : 'bg-white text-sky-700 hover:bg-sky-100'}`}
          >
            EN
          </button>
        </div>
      </div>
      {toastConfig.show && (
        <Toast
          message={toastConfig.message}
          onClear={() => setToastConfig({ show: false, message: "" })}
        />
      )}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        titleKey={modalConfig.type === "addParticipant" ? "addParticipantTitle" : "confirmTitle"}
      >
        {renderModalContent()}
      </Modal>

      <div className="w-full max-w-md bg-slate-50 shadow-2xl flex flex-col h-screen">
        <header className="p-4 text-center border-b border-gray-200 flex-shrink-0 relative">
          <h1 className="text-xl font-extrabold text-gray-800">
            {t('appTitle')} 
            <span className="text-sky-600">
               {t('appTitleSecond')}
            </span>
          </h1>
          <button
            onClick={() => openModal("confirmClearAll")}
            className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-red-500"
          >
            <Trash2 size={20} />
          </button>
        </header>

        <main className="flex-grow overflow-y-auto custom-scrollbar">
          {activeTab === "participants" && (
            <ParticipantScreen
              participants={participants}
              setParticipants={setParticipants}
              openModal={openModal}
            />
          )}
          {activeTab === "expenses" && (
            <ExpenseScreen
              expenses={expenses}
              setExpenses={setExpenses}
              participants={participants}
              addToast={addToast}
              openModal={openModal}
            />
          )}
          {activeTab === "results" && (
            <ResultsScreen
              expenses={expenses}
              transactions={transactions}
              participants={participants}
              hasCalculated={hasCalculated}
              calculateSplit={calculateSplit}
              addToast={addToast}
            />
          )}
        </main>

        <footer className="grid grid-cols-3 border-t border-gray-200 bg-white shadow-inner flex-shrink-0">
          <TabButton
            icon={Users}
            label={t('participants')}
            isActive={activeTab === "participants"}
            onClick={() => setActiveTab("participants")}
          />
          <TabButton
            icon={DollarSign}
            label={t('expenses')}
            isActive={activeTab === "expenses"}
            onClick={() => setActiveTab("expenses")}
          />
          <TabButton
            icon={Scale}
            label={t('results')}
            isActive={activeTab === "results"}
            onClick={() => setActiveTab("results")}
          />
        </footer>
      </div>
    </div>
  );
}
