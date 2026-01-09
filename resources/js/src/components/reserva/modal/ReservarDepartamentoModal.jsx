import { useEffect } from "react";
import { Drawer, Modal } from "@mantine/core";
import { ReservarDepartamentoForm, TextSection } from "../../../components";
import {
    useDepartamentoStore,
    useHuespedStore,
    useProvinciaStore,
    useReservaDepartamentoStore,
    useUiReservaDepartamento,
} from "../../../hooks";
import { hasLength, useForm } from "@mantine/form";
import dayjs from "dayjs";
import { capitalizarCadaPalabra } from "../../../helpers/fnHelper";

export const ReservarDepartamentoModal = () => {
    const { fnCargarDepartamentosDisponibles, fnAsignarDepartamento } =
        useDepartamentoStore();
    const { activarTipoReserva } = useReservaDepartamentoStore();
    const { abrirModalReservarDepartamento, fnAbrirModalReservarDepartamento } =
        useUiReservaDepartamento();
    const { fnCargarProvincias } = useProvinciaStore();
    const { fnAsignarHuesped } = useHuespedStore();

    const reservaForm = useForm({
        mode: "controlled",
        initialValues: {
            huesped: {
                huesped_id: "",
                nombres: "",
                apellidos: "",
                dni: "",
                email: "",
                telefono: "",
                direccion: "",
                nacionalidad: "",
            },
            tipo_reserva: "",
            departamento_id: "",
            fecha_checkin: dayjs()
                .set("hour", 10)
                .set("minute", 0)
                .set("second", 0)
                .toDate(),
            fecha_checkout: "",
            total_noches: 0,
            total_pago: 0,
            total_adultos: 1,
            total_ninos: 0,
            total_mascotas: 0,
        },
        validate: {
            huesped: {
                dni: (value) =>
                    hasLength(value, { min: 8, max: 8 })
                        ? null
                        : "El DNI debe tener 8 caracteres",
                nombres: (value) =>
                    value ? null : "El nombre del huésped es obligatorio",
                apellidos: (value) =>
                    value ? null : "El apellido del huésped es obligatorio",
                email: (value) =>
                    /^\S+@\S+$/.test(value) ? null : "Email inválido",
                direccion: (value) =>
                    value.length < 2
                        ? "La direccion debe tener al menos 2 caracteres"
                        : null,
            },
            fecha_checkin: (value) =>
                value ? null : "La fecha de check-in es obligatoria",
            fecha_checkout: (value) =>
                value ? null : "La fecha de check-out es obligatoria",
        },
        transformValues: (values) => ({
            ...values,
            huesped: {
                ...values.huesped,
                huesped_id: values.huesped.huesped_id
                    ? parseInt(values.huesped.huesped_id)
                    : null,
            },
            tipo_reserva: activarTipoReserva,
            departamento_id: values.departamento_id
                ? parseInt(values.departamento_id)
                : null,
            fecha_checkin: dayjs(values.fecha_checkin).isValid()
                ? dayjs(values.fecha_checkin).format("YYYY-MM-DD HH:mm:ss")
                : null,
            fecha_checkout: dayjs(values.fecha_checkout).isValid()
                ? dayjs(values.fecha_checkout).format("YYYY-MM-DD HH:mm:ss")
                : null,
            total_noches: values.total_noches
                ? parseInt(values.total_noches)
                : 0,
            total_pago: values.total_pago ? parseFloat(values.total_pago) : 0,
            total_adultos: values.total_adultos
                ? parseInt(values.total_adultos)
                : 1,
            total_ninos: values.total_ninos ? parseInt(values.total_ninos) : 0,
            total_mascotas: values.total_mascotas
                ? parseInt(values.total_mascotas)
                : 0,
        }),
    });

    const { fecha_checkin, fecha_checkout } = reservaForm.values;

    /* Efecto de carga del departamento seleccionado  */
    useEffect(() => {
        if (
            abrirModalReservarDepartamento &&
            activarTipoReserva === "HOSPEDAJE" &&
            fecha_checkin &&
            fecha_checkout
        ) {
            fnCargarDepartamentosDisponibles({
                fecha_inicio: fecha_checkin,
                fecha_fin: fecha_checkout,
            });
        }
        fnCargarProvincias();
    }, [
        abrirModalReservarDepartamento,
        fecha_checkin,
        fecha_checkout,
        activarTipoReserva,
    ]);

    // Setear fecha_checkout automáticamente para ESTADIA
    useEffect(() => {
        console.log(activarTipoReserva);
        if (activarTipoReserva === "ESTADIA" && fecha_checkin) {
            const nuevaFechaCheckout = dayjs(fecha_checkin)
                .set("hour", 18)
                .set("minute", 0)
                .set("second", 0)
                .toDate();

            // Solo actualizar si la fecha es diferente (comparar timestamps)
            const checkoutActual = fecha_checkout
                ? dayjs(fecha_checkout).valueOf()
                : null;
            const nuevaCheckoutValue = dayjs(nuevaFechaCheckout).valueOf();

            if (checkoutActual !== nuevaCheckoutValue) {
                reservaForm.setFieldValue("fecha_checkout", nuevaFechaCheckout);
            }
        }
    }, [fecha_checkin, activarTipoReserva]);

    // Limpiar fecha_checkout cuando es HOSPEDAJE
    useEffect(() => {
        if (
            abrirModalReservarDepartamento &&
            activarTipoReserva === "HOSPEDAJE"
        ) {
            reservaForm.setFieldValue("fecha_checkout", "");
        }
    }, [abrirModalReservarDepartamento, activarTipoReserva]);

    const handleCerrarModal = () => {
        // Lógica para cerrar el modal
        fnAsignarHuesped(null);
        fnAsignarDepartamento(null);
        reservaForm.reset();
        fnAbrirModalReservarDepartamento(false);
    };

    return (
        <Drawer
            position="right"
            closeOnClickOutside={false}
            closeOnEscape={false}
            opened={abrirModalReservarDepartamento}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={18} fw={700}>
                    Reservar {capitalizarCadaPalabra(activarTipoReserva ?? "")}
                </TextSection>
            }
            size={950}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <ReservarDepartamentoForm reservaForm={reservaForm} />
        </Drawer>
    );
};
