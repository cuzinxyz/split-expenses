import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputWithLabel from "../components/input/InputWithLabel";
import SearchableSelect from "../components/selectbox/SearchableSelect";
import ActionButton from "../components/button/ActionButton";
import { vietnameseBanks } from "../constants/vietnameseBanks";
import type { Participant } from "../types";

type AddParticipantFormProps = {
  onAdd: (participant: Participant) => void;
  onClose: () => void;
  addToast: (message: string) => void;
};

export const AddParticipantForm: React.FC<AddParticipantFormProps> = ({
  onAdd,
  onClose,
  addToast,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState<string>("");
  const [bank, setBank] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");

  const handleSubmit = () => {
    if (!name || !bank || !accountNumber) {
      addToast(t("pleaseFillAllFields"));
      return;
    }

    const newParticipant: Participant = {
      id: Date.now().toString(),
      name,
      bank,
      accountNumber,
    };

    onAdd(newParticipant);
    addToast(t("participantAdded"));
    onClose();
  };

  return (
    <div className="space-y-4">
      <InputWithLabel
        id="name"
        label={t("addParticipant")}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <SearchableSelect
        options={vietnameseBanks}
        value={bank}
        onChange={setBank}
        placeholder={t("bank")}
        valueKey="code"
      />

      <InputWithLabel
        id="account"
        label={t("bankNumber")}
        value={accountNumber}
        onChange={(e) =>
          setAccountNumber(e.target.value.replace(/[^0-9]/g, ""))
        }
        type="text"
        pattern="\d*"
      />

      <ActionButton onClick={handleSubmit} className="mt-4">
        <UserPlus className="mr-2" /> {t("add")}
      </ActionButton>
    </div>
  );
};
