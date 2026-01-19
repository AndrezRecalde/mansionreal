import { useEffect, useRef, useState, useCallback } from "react";
import { Stack } from "@mantine/core";
import { Views } from "react-big-calendar";
import { subMonths, addMonths, startOfMonth, endOfMonth } from "date-fns";
import {
    useCalendarioStore,
    useReservaDepartamentoStore,
    //useReservaDepartamentoStore,
    useUiConsumo,
    useUiReservaDepartamento,
} from "../../../hooks";
import {
    CalendarioGrid,
    //CalendarioHeader,
    CalendarioKPIs,
    InformacionReservaModal,
} from "../../../components";
import { formatDateStr } from "../../../helpers/fnHelper";

export const CalendarioReservas = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState(Views.MONTH);
    const [rangosCargados, setRangosCargados] = useState({
        start: null,
        end: null,
    });
    const [mesActualKPI, setMesActualKPI] = useState(null);

    const cargaInicial = useRef(false);
    const cargandoNavegacion = useRef(false);

    const {
        cargando,
        reservas,
        recursosDepartamentos,
        estadisticasOcupacion,
        fnCargarDatosCalendario,
        fnCargarEstadisticasOcupacion,
        activarReserva,
        fnAsignarReserva,
    } = useCalendarioStore();
    const { fnAsignarReserva: fnAsignarReservaDepartamento } =
        useReservaDepartamentoStore();
    const { abrirModalInformacionReserva, fnAbrirModalInformacionReserva } =
        useUiReservaDepartamento();

    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();

    const actualizarEstadisticas = useCallback(
        async (fecha) => {
            const inicioMes = startOfMonth(fecha);
            const finMes = endOfMonth(fecha);
            const mesKey = `${fecha.getFullYear()}-${fecha.getMonth()}`;

            if (mesActualKPI === mesKey) return;

            setMesActualKPI(mesKey);

            await fnCargarEstadisticasOcupacion({
                fecha_inicio: formatDateStr(inicioMes),
                fecha_fin: formatDateStr(finMes),
            });
        },
        [mesActualKPI, fnCargarEstadisticasOcupacion]
    );

    const cargarDatosIniciales = useCallback(async () => {
        const inicio = subMonths(new Date(), 3);
        const fin = addMonths(new Date(), 3);

        setRangosCargados({ start: inicio, end: fin });

        await fnCargarDatosCalendario({
            start: formatDateStr(inicio),
            end: formatDateStr(fin),
        });

        await actualizarEstadisticas(new Date());
    }, [fnCargarDatosCalendario, actualizarEstadisticas]);

    const cargarMasDatos = useCallback(
        async (fecha) => {
            if (cargandoNavegacion.current) return;
            if (!rangosCargados.start || !rangosCargados.end) return;

            const fechaInicio = startOfMonth(fecha);
            const fechaFin = endOfMonth(fecha);
            const necesitaCargarDatos =
                fechaInicio < rangosCargados.start ||
                fechaFin > rangosCargados.end;

            cargandoNavegacion.current = true;

            try {
                if (necesitaCargarDatos) {
                    let nuevoInicio = rangosCargados.start;
                    let nuevoFin = rangosCargados.end;

                    if (fechaInicio < rangosCargados.start) {
                        nuevoInicio = subMonths(fechaInicio, 3);
                    }

                    if (fechaFin > rangosCargados.end) {
                        nuevoFin = addMonths(fechaFin, 3);
                    }

                    setRangosCargados({ start: nuevoInicio, end: nuevoFin });

                    await fnCargarDatosCalendario({
                        start: formatDateStr(nuevoInicio),
                        end: formatDateStr(nuevoFin),
                    });
                }

                await actualizarEstadisticas(fecha);
            } finally {
                cargandoNavegacion.current = false;
            }
        },
        [rangosCargados, fnCargarDatosCalendario, actualizarEstadisticas]
    );

    useEffect(() => {
        if (cargaInicial.current) return;
        cargaInicial.current = true;
        cargarDatosIniciales();
    }, [cargarDatosIniciales]);

    const handleNavigate = useCallback(
        async (newDate) => {
            setCurrentDate(newDate);
            await cargarMasDatos(newDate);
        },
        [cargarMasDatos]
    );

    const handleViewChange = useCallback((newView) => {
        setCurrentView(newView);
    }, []);

    const handleSelectEvent = useCallback((evento) => {
        const reserva = {
            id: evento.id,
            title: evento.title,
            start: evento.start,
            end: evento.end,
            codigo_reserva: evento.codigo_reserva,
            huesped: evento.huesped,
            departamento: evento.departamento,
            estado: evento.estado,
            total_noches: evento.total_noches,
            total_adultos: evento.total_adultos,
            total_ninos: evento.total_ninos,
            total_mascotas: evento.total_mascotas,
        };

        fnAsignarReserva(reserva);
        fnAbrirModalInformacionReserva(true);
    }, []);

    const handleRefresh = async () => {
        cargaInicial.current = false;
        setRangosCargados({ start: null, end: null });
        setMesActualKPI(null);
        await cargarDatosIniciales();
    };

    const handleCloseModal = useCallback(() => {
        fnAbrirModalInformacionReserva(false);
    }, []);

    const handleVerReserva = useCallback((reserva) => {
        //console.log("aki");
        // Implementar navegación a la página de detalles de la reserva si es necesario
        const datosReserva = {
            departamento_id: reserva.departamento.id,
            tipo_departamento: reserva.departamento.tipo_departamento,
            numero_departamento: reserva.departamento.numero,
            codigo_reserva: reserva.codigo_reserva,
            reserva_id: reserva.id,
            huesped_id: reserva.huesped.id,
            huesped: reserva.huesped.nombres_completos,
            fecha_checkin: reserva.start,
            fecha_checkout: reserva.end,
            total_noches: reserva.total_noches,
            estado: reserva.estado,
        };
        fnAsignarReservaDepartamento(datosReserva);
        fnAbrirDrawerConsumosDepartamento(true);
        fnAbrirModalInformacionReserva(false);
    }, []);

    return (
        <Stack gap="md">
            <CalendarioKPIs
                estadisticas={estadisticasOcupacion}
                cargando={cargando}
                onRefresh={handleRefresh}
            />

            <CalendarioGrid
                cargando={cargando}
                reservas={reservas}
                recursos={recursosDepartamentos}
                currentDate={currentDate}
                currentView={currentView}
                onNavigate={handleNavigate}
                onViewChange={handleViewChange}
                onSelectEvent={handleSelectEvent}
            />

            <InformacionReservaModal
                abrirModal={abrirModalInformacionReserva}
                cerrarModal={handleCloseModal}
                abrirModalConsumos={handleVerReserva}
                reserva={activarReserva}
            />
        </Stack>
    );
};
