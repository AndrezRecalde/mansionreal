import { useEffect, useState } from "react";
import {
    Modal,
    Select,
    NumberInput,
    TextInput,
    Button,
    Stack,
    Text,
    Group,
} from "@mantine/core";
import { useCajasStore } from "../../../hooks";
import { IconArrowsExchange } from "@tabler/icons-react";

export const MovimientoCajaModal = () => {
    const {
        isMovimientoModalOpen,
        setModalMovimiento,
        fnCrearMovimiento,
        cargando,
    } = useCajasStore();

    const [tipo, setTipo] = useState("INGRESO");
    const [monto, setMonto] = useState("");
    const [concepto, setConcepto] = useState("");

    useEffect(() => {
        if (isMovimientoModalOpen) {
            setTipo("INGRESO");
            setMonto("");
            setConcepto("");
        }
    }, [isMovimientoModalOpen]);

    const handleGuardar = async () => {
        if (!monto || !concepto) return;

        await fnCrearMovimiento({
            tipo,
            monto: Number(monto),
            concepto,
        });
    };

    return (
        <Modal
            opened={isMovimientoModalOpen}
            onClose={() => setModalMovimiento(false)}
            title={
                <Group gap="sm">
                    <IconArrowsExchange size={24} color="#20c997" />
                    <Text fw={700} size="lg">
                        Registrar Movimiento en Gaveta
                    </Text>
                </Group>
            }
            centered
        >
            <Stack>
                <Text size="sm" c="dimmed">
                    Utilice esta opción para asentar entradas o salidas de
                    dinero en efectivo que no corresponden a ventas estándar del
                    sistema.
                </Text>

                <Select
                    label="Tipo de Movimiento"
                    data={[
                        { value: "INGRESO", label: "INGRESO DE DINERO (+)" },
                        { value: "EGRESO", label: "EGRESO / RETIRO (-)" },
                    ]}
                    value={tipo}
                    onChange={setTipo}
                    required
                />

                <NumberInput
                    label="Monto"
                    placeholder="0.00"
                    prefix="$ "
                    min={0.01}
                    decimalScale={2}
                    fixedDecimalScale
                    value={monto}
                    onChange={setMonto}
                    required
                />

                <TextInput
                    label="Concepto / Razón"
                    placeholder="Ej. Sencillo por Admin, o Pago Votellón Agua"
                    value={concepto}
                    onChange={(e) => setConcepto(e.currentTarget.value)}
                    required
                    maxLength={255}
                />

                <Button
                    fullWidth
                    size="md"
                    mt="md"
                    color={tipo === "INGRESO" ? "teal" : "red"}
                    disabled={!monto || !concepto || cargando}
                    loading={cargando}
                    onClick={handleGuardar}
                >
                    Registrar {tipo}
                </Button>
            </Stack>
        </Modal>
    );
};
