/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { BarChart3, CheckCircle2, Vote } from 'lucide-react';

interface PollOption {
  id: string;
  option_text: string;
  votes_count: number;
}

interface PollProps {
  pollData?: {
    id: string;
    question: string;
    options: PollOption[];
  };
}

const DEFAULT_POLL = {
  id: "poll-1",
  question: "On average, how many hours of restorative sleep do you get each night?",
  options: [
    { id: "opt-1", option_text: "Less than 5 hours (Deficit)", votes_count: 142 },
    { id: "opt-2", option_text: "5 to 6 hours (Mildly sub-optimal)", votes_count: 389 },
    { id: "opt-3", option_text: "7 to 8 hours (Recommended)", votes_count: 814 },
    { id: "opt-4", option_text: "More than 8 hours (Extended)", votes_count: 198 },
  ]
};

export function HealthPollWidget({ pollData }: PollProps) {
  const poll = pollData || DEFAULT_POLL;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [options, setOptions] = useState(poll.options);

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes_count, 0);

  const handleVote = () => {
    if (!selectedOption || hasVoted) return;

    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === selectedOption
          ? { ...opt, votes_count: opt.votes_count + 1 }
          : opt
      )
    );
    setHasVoted(true);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#2E7D32]/20 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Vote size={18} className="text-[#f06d2f]" />
          <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-[#1B5E20]">
            HEALTHGHURU READER POLL
          </h3>
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          {totalVotes.toLocaleString()} votes cast
        </span>
      </div>

      <p className="font-heading font-bold text-sm sm:text-base text-[#1A2E1A] leading-snug mb-4">
        {poll.question}
      </p>

      {/* Options List */}
      <div className="space-y-2.5">
        {options.map((opt) => {
          const percentage = totalVotes > 0 ? Math.round((opt.votes_count / totalVotes) * 100) : 0;
          const isSelected = selectedOption === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => !hasVoted && setSelectedOption(opt.id)}
              className={`relative rounded-xl p-3 border transition-all cursor-pointer select-none overflow-hidden ${
                isSelected
                  ? "border-[#2E7D32] bg-[#F5FAF5]"
                  : "border-gray-200 hover:border-[#2E7D32]/40 bg-white"
              }`}
            >
              {/* Progress fill after vote */}
              {hasVoted && (
                <div
                  className="absolute left-0 top-0 bottom-0 bg-[#2E7D32]/15 transition-all duration-700 pointer-events-none"
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative flex items-center justify-between gap-3 text-xs font-heading font-medium">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-[#2E7D32] bg-[#2E7D32] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span className="text-[#1A2E1A] font-semibold">{opt.option_text}</span>
                </div>

                {hasVoted && (
                  <span className="font-mono font-bold text-[#1B5E20] shrink-0">
                    {percentage}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-3 flex items-center justify-between">
        {!hasVoted ? (
          <button
            onClick={handleVote}
            disabled={!selectedOption}
            className={`w-full py-2.5 rounded-xl font-heading font-bold text-xs transition-all shadow-xs ${
              selectedOption
                ? "bg-[#1B5E20] hover:bg-[#2E7D32] text-white active:scale-95 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Vote
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-[#2E7D32] font-semibold mx-auto">
            <CheckCircle2 size={15} />
            <span>Thank you for voting! Live results tabulated.</span>
          </div>
        )}
      </div>
    </div>
  );
}
