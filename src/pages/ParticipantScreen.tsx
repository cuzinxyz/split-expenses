import React from "react";
import { Banknote, Trash2, UserPlus } from "lucide-react";
import ActionButton from "../components/button/ActionButton";
import { vietnameseBanks } from '../constants/vietnameseBanks'
import type { Participant } from '../types';
import { useTranslation } from 'react-i18next';

type ParticipantScreenProps = {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  openModal: (type: string) => void;
};

export const ParticipantScreen: React.FC<ParticipantScreenProps> = ({
  participants,
  setParticipants,
  openModal,
}) => {
  const { t } = useTranslation();

  const getBankName = (code: string) =>
    vietnameseBanks.find((b) => b.code === code)?.name || code;

  const handleRemove = (id: Participant["id"]) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">{t('participants')}</h2>
      <ActionButton onClick={() => openModal("addParticipant")}> 
        <UserPlus className="mr-2" size={20} /> {t('addParticipant')}
      </ActionButton>
      <div className="space-y-3">
        {participants.map((p) => (
          <div
            key={p.id}
            className="bg-gray-50 rounded-lg p-4 shadow-sm animate-fade-in flex justify-between items-start border border-gray-200"
          >
            <div>
              <p className="font-bold text-gray-800 text-base">{p.name}</p>
              <div className="text-sm text-gray-600 mt-1 flex items-center">
                <Banknote
                  size={16}
                  className="mr-2 text-green-600 flex-shrink-0"
                />
                <span>
                  {getBankName(p.bank)} - {t('bankNumber')}: {p.accountNumber}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleRemove(p.id)}
              className="text-red-500 hover:text-red-700 transition-colors ml-2"
              title={t('delete')}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
