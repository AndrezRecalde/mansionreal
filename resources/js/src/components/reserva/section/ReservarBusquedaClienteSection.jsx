import { useEffect } from "react";
import { Fieldset } from "@mantine/core";
import { useHuespedStore, useReservaDepartamentoStore } from "../../../hooks";
import {
    ReservarBusquedaClienteForm,
    ReservarDatosClienteForm,
    TextSection,
} from "../../../components";
import dayjs from "dayjs";

export const ReservarBusquedaClienteSection = ({
    reservaForm,
    showDetails,
    setShowDetails,
    disabledInput,
    handleSubmitHuesped,
    labelStyles,
}) => {
    const { activarHuesped, fnAsignarHuesped, cargando } = useHuespedStore();
    const { activarTipoReserva } = useReservaDepartamentoStore();

    useEffect(() => {
        if (activarHuesped !== null) {
            reservaForm.setValues({
                huesped: {
                    huesped_id: activarHuesped.id,
                    nombres_completos: activarHuesped.nombres_completos,
                    dni: activarHuesped.dni,
                    email: activarHuesped.email,
                    telefono: activarHuesped.telefono || "",
                },
            });
            fnAsignarHuesped(activarHuesped);
            setShowDetails(true);
            return;
        }
        // eslint-disable-next-line
    }, [activarHuesped]);

    // Cuando se presiona Limpiar
    const handleClear = () => {
        reservaForm.setValues({
            huesped: {
                huesped_id: "",
                nombres_completos: "",
                dni: "",
                email: "",
                telefono: "",
            },
            tipo_reserva: activarTipoReserva,
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
        });
        fnAsignarHuesped(null);
        setShowDetails(false);
    };

    return (
        <Fieldset
            legend={
                <TextSection tt="" fz={16} fw={300}>
                    Datos del Huesped Anfitrión
                </TextSection>
            }
        >
            <>
                <ReservarBusquedaClienteForm
                    reservaForm={reservaForm}
                    showDetails={showDetails}
                    disabledInput={disabledInput}
                    cargando={cargando}
                    handleSubmitHuesped={handleSubmitHuesped}
                    handleClear={handleClear}
                    labelStyles={labelStyles}
                />
            </>
            <ReservarDatosClienteForm
                reservaForm={reservaForm}
                showDetails={showDetails}
                disabledInput={disabledInput}
                labelStyles={labelStyles}
            />
        </Fieldset>
    );
};
