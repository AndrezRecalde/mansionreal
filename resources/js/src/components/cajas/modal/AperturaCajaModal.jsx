import { useEffect, useState } from "react";
import {
    Modal,
    Select,
    NumberInput,
    Button,
    Stack,
    Text,
    Alert,
    Group,
} from "@mantine/core";
import { useCajasStore } from "../../../hooks";
import { IconAlertCircle, IconCash } from "@tabler/icons-react";

export const AperturaCajaModal = () => {
    const {
        isAperturaModalOpen,
        cajasDisponibles,
        fnAbrirTurno,
        cargando,
        checkMiTurno,
        turnoActivo,
        setModalApertura,
    } = useCajasStore();

    const [cajaId, setCajaId] = useState(null);
    const [montoApertura, setMontoApertura] = useState(0);

    // Al abrir el modal, validar si ya tiene turno
    useEffect(() => {
        if (isAperturaModalOpen && !cajasDisponibles?.length) {
            checkMiTurno();
        }
    }, [isAperturaModalOpen]);

    const handleAbrirCaja = async () => {
        if (!cajaId) return;

        const success = await fnAbrirTurno({
            caja_id: cajaId,
            monto_apertura_efectivo: montoApertura || 0,
        });

        if (success) {
            // Se cerrará automáticamente desde el hook
            setCajaId(null);
            setMontoApertura(0);
        }
    };

    // Permitir cerrar el modal si no hay turno abierto (Bloqueo forzoso)
    const handleClose = () => {
        /* if (turnoActivo) {
            // permitir cerrar
            // pero el modal ya se cierra auto desde Redux
        } */
        setModalApertura(false);
    };

    return (
        <Modal
            opened={isAperturaModalOpen}
            onClose={handleClose}
            //withCloseButton={false}
            closeOnClickOutside={false}
            closeOnEscape={false}
            title={
                <Group gap="sm">
                    <IconCash size={24} color="#1c7ed6" />
                    <Text fw={700} size="lg">
                        Turno de Caja
                    </Text>
                </Group>
            }
            centered
        >
            <Stack>
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Atención"
                    color="blue"
                    variant="light"
                >
                    Por favor, selecciona una caja y declara con cuánto efectivo
                    libre inicias tu turno. Si no posees efectivo inicial,
                    puedes ingresar $0.00.
                </Alert>

                <Select
                    label="Estación de Caja Blanca"
                    placeholder="Seleccione donde está cobrando"
                    data={cajasDisponibles.map((c) => ({
                        value: c.id.toString(),
                        label: c.nombre,
                    }))}
                    value={cajaId}
                    onChange={setCajaId}
                    required
                />

                <NumberInput
                    label="Efectivo en gaveta (Monto Inicial)"
                    description="Ingrese su fondo de apertura."
                    placeholder="0.00"
                    prefix="$ "
                    min={0}
                    decimalScale={2}
                    fixedDecimalScale
                    value={montoApertura}
                    onChange={setMontoApertura}
                    required
                />

                <Button
                    fullWidth
                    size="md"
                    mt="md"
                    disabled={!cajaId || cargando}
                    loading={cargando}
                    onClick={handleAbrirCaja}
                >
                    Confirmar Inicio de Turno
                </Button>
            </Stack>
        </Modal>
    );
};
