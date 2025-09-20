import { useEffect } from "react";
import { Modal } from "@mantine/core";
import { ReservarDepartamentoForm, TextSection } from "../../../components";
import {
    useDepartamentoStore,
    useHuespedStore,
    useProvinciaStore,
    useUiReservaDepartamento,
} from "../../../hooks";
import { hasLength, useForm } from "@mantine/form";
import dayjs from "dayjs";

export const ReservarDepartamentoModal = () => {
    const { activarDepartamento } = useDepartamentoStore();
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
                provincia_id: "",
            },
            departamento_id: "",
            fecha_checkin: "",
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
                provincia_id: values.huesped.provincia_id
                    ? parseInt(values.huesped.provincia_id)
                    : null,
            },
            departamento_id: values.departamento_id
                ? parseInt(values.departamento_id)
                : null,
            fecha_checkin: dayjs(values.fecha_checkin).isValid()
                ? dayjs(values.fecha_checkin).format("YYYY-MM-DD")
                : null,
            fecha_checkout: dayjs(values.fecha_checkout).isValid()
                ? dayjs(values.fecha_checkout).format("YYYY-MM-DD")
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

    useEffect(() => {
        if (abrirModalReservarDepartamento) {
            fnCargarProvincias();
            reservaForm.setFieldValue(
                "departamento_id",
                activarDepartamento.id
            );
        }
    }, [abrirModalReservarDepartamento]);

    const handleCerrarModal = () => {
        // Lógica para cerrar el modal
        fnAsignarHuesped(null);
        reservaForm.reset();
        fnAbrirModalReservarDepartamento(false);
    };

    return (
        <Modal
            closeOnClickOutside={false}
            closeOnEscape={false}
            opened={abrirModalReservarDepartamento}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Reservar Departamento
                </TextSection>
            }
            size={950}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <ReservarDepartamentoForm reservaForm={reservaForm} />
        </Modal>
    );
};
