import { useState } from "react";
import { Stack } from "@mantine/core";
import {
    ReservarBusquedaClienteSection,
    ReservarDatosReservaSection,
} from "../../../components";
import {
    useEstadiaStore,
    useHuespedStore,
    useReservaDepartamentoStore,
    useUiReservaDepartamento,
} from "../../../hooks";
import classes from "../modules/ReservarDepartamento.module.css";
import classess from "../../../components/elements/modules/LabelsInput.module.css"
import Swal from "sweetalert2";

export const ReservarDepartamentoForm = ({ reservaForm }) => {
    const { fnBuscarHuespedPorDni, activarHuesped, fnAsignarHuesped } =
        useHuespedStore();
    const { fnAgregarReserva, activarTipoReserva } =
        useReservaDepartamentoStore();
    const { fnAbrirModalReservarDepartamento } = useUiReservaDepartamento();
    const { fnAgregarEstadia } = useEstadiaStore();
    const [showDetails, setShowDetails] = useState(false);

    const disabledInput = activarHuesped !== null;

    const handleSubmitHuesped = (e) => {
        e.preventDefault();
        const dni = reservaForm.getValues().huesped.dni;
        //console.log(dni);
        fnBuscarHuespedPorDni(dni);
        setShowDetails(true);
    };

    const handleSubmitReserva = (e) => {
        e.preventDefault();
        Swal.fire({
            title: "¿Confirmar reserva?",
            text: "¿Desea confirmar la reserva del departamento?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, reservar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(activarTipoReserva);
                if (activarTipoReserva === "HOSPEDAJE") {
                    fnAgregarReserva(reservaForm.getTransformedValues());
                    console.log(
                        "HOSPEDAJE:",
                        reservaForm.getTransformedValues()
                    );
                } else {
                    fnAgregarEstadia(reservaForm.getTransformedValues());
                    console.log("ESTADIA:", reservaForm.getTransformedValues());
                }
                reservaForm.reset();
                fnAsignarHuesped(null);
                setShowDetails(false);
                fnAbrirModalReservarDepartamento(false);
            }
        });
    };

    return (
        <Stack bg="var(--mantine-color-body)" justify="center">
            <ReservarBusquedaClienteSection
                reservaForm={reservaForm}
                showDetails={showDetails}
                setShowDetails={setShowDetails}
                disabledInput={disabledInput}
                handleSubmitHuesped={handleSubmitHuesped}
                labelStyles={classess}
            />
            {showDetails && (
                <ReservarDatosReservaSection
                    classes={classes}
                    reservaForm={reservaForm}
                    handleSubmitReserva={handleSubmitReserva}
                    labelStyles={classess}
                />
            )}
        </Stack>
    );
};
