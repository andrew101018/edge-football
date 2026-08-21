interface Player {
  id: number;
  name: string;
  number: number;
  pos: string;
  grid?: string;
}

interface LineupProps {
  teamName: string;
  formation: string;
  startXI: Player[];
}

export default function PitchLineup({ teamName, formation, startXI }: LineupProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 font-sans" dir="rtl">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white">{teamName}</h3>
        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono font-bold border border-emerald-500/20">
          خطة: {formation}
        </span>
      </div>

      {/* بساط الملعب الأخضر */}
      <div className="relative w-full h-[400px] bg-gradient-to-b from-emerald-800 to-emerald-950 rounded-xl border-2 border-emerald-500/40 overflow-hidden shadow-inner flex flex-col justify-between p-4">
        
        {/* خطوط الملعب التكتيكية */}
        <div className="absolute inset-0 border border-white/20 m-2 pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-white/20"></div>

        {/* توزيع اللاعبين التلقائي حسب المراكز */}
        <div className="relative z-10 h-full flex flex-col justify-around">
          
          {/* حارس المرمى */}
          <div className="flex justify-center">
            {startXI.filter((p) => p.pos === 'G').map((p) => (
              <PlayerBadge key={p.id} player={p} isGK />
            ))}
          </div>

          {/* خط الدفاع */}
          <div className="flex justify-around">
            {startXI.filter((p) => p.pos === 'D').map((p) => (
              <PlayerBadge key={p.id} player={p} />
            ))}
          </div>

          {/* خط الوسط */}
          <div className="flex justify-around">
            {startXI.filter((p) => p.pos === 'M').map((p) => (
              <PlayerBadge key={p.id} player={p} />
            ))}
          </div>

          {/* خط الهجوم */}
          <div className="flex justify-around">
            {startXI.filter((p) => p.pos === 'F').map((p) => (
              <PlayerBadge key={p.id} player={p} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

function PlayerBadge({ player, isGK }: { player: Player; isGK?: boolean }) {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg border-2 transition transform group-hover:scale-110 ${
        isGK 
          ? 'bg-amber-400 text-slate-950 border-amber-200' 
          : 'bg-slate-950 text-white border-emerald-400'
      }`}>
        {player.number}
      </div>
      <span className="text-[10px] text-white font-bold bg-slate-950/80 px-1.5 py-0.5 rounded mt-1 shadow truncate max-w-[80px]">
        {player.name}
      </span>
    </div>
  );
}