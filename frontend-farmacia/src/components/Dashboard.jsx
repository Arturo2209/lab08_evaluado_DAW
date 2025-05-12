import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ServicioAutenticacion from '../services/auth.service';
import ServicioFarmacia from '../services/farmacia.service';
import './Dashboard.css';

const Dashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ medicamentos: 0, laboratorios: 0, ordenes: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioActual = ServicioAutenticacion.obtenerUsuarioActual();
    if (!usuarioActual) {
      navigate('/login');
      return;
    }
    setUsuario(usuarioActual);
    cargarEstadisticas();
  }, [navigate]);

  const cargarEstadisticas = async () => {
    try {
      const [resMedicamentos, resLaboratorios, resOrdenes] = await Promise.all([
        ServicioFarmacia.obtenerMedicamentos().catch(() => ({ data: [] })),
        ServicioFarmacia.obtenerLaboratorios().catch(() => ({ data: [] })),
        ServicioFarmacia.obtenerOrdenesCompra().catch(() => ({ data: [] }))
      ]);

      setStats({
        medicamentos: resMedicamentos.data.length,
        laboratorios: resLaboratorios.data.length,
        ordenes: resOrdenes.data.length
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="cargando">Cargando panel de control...</div>;

  const esAdmin = usuario?.roles?.includes('ROLE_ADMIN');

  return (
    <div className="dashboard-container">
      <h1>Panel de Control</h1>
      <div className="welcome-message">
        Bienvenido, <strong>{usuario?.username}</strong>
      </div>

      <div className="stat-list">
        <div className="stat-item">
          <div className="stat-title">Medicamentos</div>
          <div className="stat-value">{stats.medicamentos}</div>
        </div>
        <div className="stat-item">
          <div className="stat-title">Laboratorios</div>
          <div className="stat-value">{stats.laboratorios}</div>
        </div>
        <div className="stat-item">
          <div className="stat-title">Órdenes de Compra</div>
          <div className="stat-value">{stats.ordenes}</div>
        </div>
      </div>

      <div className="quick-links">
        <h2>Accesos Rápidos</h2>

        <div className="link-item">
          <div className="link-title">Medicamentos</div>
          <div className="link-actions">
            <Link to="/medicamentos">Ver</Link>
            {esAdmin && <Link to="/medicamentos/nuevo">Añadir</Link>}
          </div>
        </div>

        {esAdmin && (
          <div className="link-item">
            <div className="link-title">Laboratorios</div>
            <div className="link-actions">
              <Link to="/laboratorios">Ver</Link>
              <Link to="/laboratorios/nuevo">Añadir</Link>
            </div>
          </div>
        )}

        <div className="link-item">
          <div className="link-title">Órdenes de Compra</div>
          <div className="link-actions">
            <Link to="/ordenes-compra">Ver</Link>
            <Link to="/ordenes-compra/nueva">Nueva</Link>
          </div>
        </div>

        {esAdmin && (
          <div className="link-item">
            <div className="link-title">Usuarios</div>
            <div className="link-actions">
              <Link to="/usuarios">Ver</Link>
              <Link to="/usuarios/nuevo">Añadir</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
