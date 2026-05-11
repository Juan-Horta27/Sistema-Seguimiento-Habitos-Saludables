'use client';

import { useState } from 'react';
import { API_URL } from '@/services/api';

interface Semana {
  inicio: string;
  fin: string;
  registros: Array<{
    id: number;
    habitoId: number;
    fecha: string;
    valorRegistrado: number;
    metaCumplida: boolean;
    habito: { nombre: string; unidadMedida: string };
  }>;
  cumplidas: number;
  porcentaje: number;
}

interface RangoData {
  rango: { desde: string; hasta: string };
  estadisticasGenerales: {
    totalRegistros: number;
    metasCumplidas: number;
    porcentajeCumplimiento: number;
  };
  semanas: Semana[];
}

const USUARIO_ID = 1; // TODO: del token JWT

export default function HistorialPage() {
  const now = new Date();
  const [modo, setModo] = useState<'mensual' | 'rango'>('mensual');
  const [anio, setAnio] = useState(String(now.getFullYear()));
  const [mes, setMes] = useState(String(now.getMonth() + 1));
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [data, setData] = useState<RangoData | null>(null);
  const [mensualData, setMensualData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buscarMensual = async () => {
    setLoading(true);
    setError('');
    const res = await fetch(
      `${API_URL}/historial/mensual?usuarioId=${USUARIO_ID}&anio=${anio}&mes=${mes}`,
    );
    const json = await res.json();
    if (!res.ok) {
      setError(json.message ?? 'Error al cargar');
    } else {
      setMensualData(json.data ?? json);
    }
    setLoading(false);
  };

  const buscarRango = async () => {
    if (!desde || !hasta) { setError('Ingresa las fechas'); return; }
    setLoading(true);
    setError('');
    const res = await fetch(
      `${API_URL}/historial/rango?usuarioId=${USUARIO_ID}&desde=${desde}&hasta=${hasta}`,
    );
    const json = await res.json();
    if (!res.ok) {
      setError(json.message ?? 'Error al cargar');
    } else {
      setData(json.data ?? json);
    }
    setLoading(false);
  };

  const MESES = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#E6EDF3', marginBottom: 24 }}>
        📊 Historial
      </h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#161B22', borderRadius: 8, padding: 4, width: 'fit-content' }}>
        {(['mensual', 'rango'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setModo(m); setData(null); setMensualData(null); setError(''); }}
            style={{
              background: modo === m ? '#21262D' : 'transparent',
              border: modo === m ? '1px solid #30363D' : '1px solid transparent',
              color: modo === m ? '#E6EDF3' : '#8B949E',
              borderRadius: 6,
              padding: '8px 20px',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: modo === m ? 600 : 400,
            }}
          >
            {m === 'mensual' ? '📅 Mensual' : '📆 Por rango'}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 10, padding: 20, marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        {modo === 'mensual' ? (
          <>
            <div>
              <label style={{ display: 'block', color: '#8B949E', fontSize: 12, marginBottom: 4 }}>Mes</label>
              <select
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                style={{ background: '#0D1117', border: '1px solid #30363D', borderRadius: 6, padding: '8px 12px', color: '#E6EDF3', fontSize: 14 }}
              >
                {MESES.map((n, i) => (
                  <option key={i} value={i + 1}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#8B949E', fontSize: 12, marginBottom: 4 }}>Año</label>
              <input
                type="number"
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
                style={{ background: '#0D1117', border: '1px solid #30363D', borderRadius: 6, padding: '8px 12px', color: '#E6EDF3', fontSize: 14, width: 90 }}
              />
            </div>
            <button
              onClick={buscarMensual}
              disabled={loading}
              style={{ background: '#2DD4BF', color: '#0D1117', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
            >
              {loading ? 'Cargando...' : 'Buscar'}
            </button>
          </>
        ) : (
          <>
            <div>
              <label style={{ display: 'block', color: '#8B949E', fontSize: 12, marginBottom: 4 }}>Desde</label>
              <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)}
                style={{ background: '#0D1117', border: '1px solid #30363D', borderRadius: 6, padding: '8px 12px', color: '#E6EDF3', fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#8B949E', fontSize: 12, marginBottom: 4 }}>Hasta</label>
              <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)}
                style={{ background: '#0D1117', border: '1px solid #30363D', borderRadius: 6, padding: '8px 12px', color: '#E6EDF3', fontSize: 14 }} />
            </div>
            <button onClick={buscarRango} disabled={loading}
              style={{ background: '#2DD4BF', color: '#0D1117', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
              {loading ? 'Cargando...' : 'Buscar'}
            </button>
          </>
        )}
      </div>

      {error && (
        <div style={{ background: '#3D1A1A', border: '1px solid #F85149', borderRadius: 8, padding: '12px 16px', color: '#F85149', marginBottom: 20, fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Resultado mensual */}
      {mensualData && modo === 'mensual' && (
        <div>
          <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <h2 style={{ color: '#E6EDF3', fontSize: 18, fontWeight: 600, margin: '0 0 16px' }}>
              {mensualData.periodo?.nombre}
            </h2>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <Stat label="Total registros" valor={mensualData.estadisticasGenerales?.totalRegistros} color="#2DD4BF" />
              <Stat label="Metas cumplidas" valor={mensualData.estadisticasGenerales?.metasCumplidas} color="#3FB950" />
              <Stat label="% Cumplimiento" valor={`${mensualData.estadisticasGenerales?.porcentajeCumplimiento}%`} color="#F0883E" />
            </div>
          </div>

          {(mensualData.habitos ?? []).map((h: any) => (
            <div key={h.habito.id} style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 10, padding: 18, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#E6EDF3', fontWeight: 600 }}>{h.habito.nombre}</span>
                <span style={{ color: '#3FB950', fontWeight: 600 }}>{h.porcentajeCumplimiento}% cumplido</span>
              </div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <Stat label="Días registrados" valor={h.registros.length} color="#8B949E" small />
                <Stat label="Días meta cumplida" valor={h.diasCumplidos} color="#3FB950" small />
                <Stat label="Promedio diario" valor={`${h.promedioDiario} ${h.habito.unidadMedida}`} color="#2DD4BF" small />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resultado rango */}
      {data && modo === 'rango' && (
        <div>
          <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <h2 style={{ color: '#E6EDF3', fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>
              Reporte: {data.rango.desde} → {data.rango.hasta}
            </h2>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <Stat label="Total registros" valor={data.estadisticasGenerales.totalRegistros} color="#2DD4BF" />
              <Stat label="Metas cumplidas" valor={data.estadisticasGenerales.metasCumplidas} color="#3FB950" />
              <Stat label="% Cumplimiento" valor={`${data.estadisticasGenerales.porcentajeCumplimiento}%`} color="#F0883E" />
            </div>
          </div>

          {data.semanas.map((s, i) => (
            <div key={i} style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 10, padding: 18, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: '#8B949E', fontSize: 13 }}>Semana del {s.inicio} al {s.fin}</span>
                <span style={{ color: s.porcentaje >= 70 ? '#3FB950' : '#F0883E', fontWeight: 600 }}>
                  {s.cumplidas}/{s.registros.length} metas ({s.porcentaje}%)
                </span>
              </div>
              <BarraProgreso porcentaje={s.porcentaje} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, valor, color, small = false }: { label: string; valor: any; color: string; small?: boolean }) {
  return (
    <div>
      <div style={{ color, fontSize: small ? 18 : 24, fontWeight: 700 }}>{valor}</div>
      <div style={{ color: '#8B949E', fontSize: small ? 11 : 13 }}>{label}</div>
    </div>
  );
}

function BarraProgreso({ porcentaje }: { porcentaje: number }) {
  const color = porcentaje >= 80 ? '#3FB950' : porcentaje >= 50 ? '#F0883E' : '#F85149';
  return (
    <div style={{ background: '#21262D', borderRadius: 4, height: 6, overflow: 'hidden' }}>
      <div style={{ width: `${porcentaje}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.4s' }} />
    </div>
  );
}
