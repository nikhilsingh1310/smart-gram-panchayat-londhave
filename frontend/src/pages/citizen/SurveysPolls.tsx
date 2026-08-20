import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Vote, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const SurveysPolls: React.FC = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);

  const lang = i18n.language || 'en';

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/utilities/polls');
      if (res.success) {
        setPolls(res.polls);
      }
    } catch (err) {
      console.error('Fetch Polls Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      const res = await apiFetch('/utilities/polls/vote', {
        method: 'POST',
        body: JSON.stringify({ pollId, optionId })
      });

      if (res.success) {
        setVotedOptionId(optionId);
        fetchPolls();
      }
    } catch (err: any) {
      alert(err.message || 'Voting failed');
    }
  };

  const getTitle = (p: any) => {
    if (lang.startsWith('mr')) return p.titleMr;
    if (lang.startsWith('hi')) return p.titleHi;
    return p.titleEn;
  };

  const getOptText = (opt: any) => {
    if (lang.startsWith('mr')) return opt.textMr;
    if (lang.startsWith('hi')) return opt.textHi;
    return opt.textEn;
  };

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Vote className="w-6 h-6 text-amber-400" />
          नागरिक कौल व सर्वेक्षण (Citizen Polling & Feedback)
        </h2>
        <p className="text-xs text-emerald-200">
          Participate in village decision-making polls for streetlight placements, development priorities, and sanitation planning.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 text-xs">Loading Village Polls...</div>
      ) : (
        <div className="space-y-6">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce((sum: number, o: any) => sum + o.voteCount, 0);

            return (
              <div key={poll.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
                    Active Citizen Poll
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">{getTitle(poll)}</h3>
                </div>

                {/* Poll Options */}
                <div className="space-y-2.5">
                  {poll.options.map((opt: any) => {
                    const percent = totalVotes > 0 ? Math.round((opt.voteCount / totalVotes) * 100) : 0;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleVote(poll.id, opt.id)}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          votedOptionId === opt.id
                            ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/30'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex-1 pr-4">
                          <div className="text-xs font-bold text-slate-900">{getOptText(opt)}</div>
                          <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-extrabold text-emerald-800">{percent}%</div>
                          <div className="text-[10px] text-slate-400">{opt.voteCount} votes</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
