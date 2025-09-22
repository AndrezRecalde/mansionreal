import { TextInput, Group, Button } from "@mantine/core";
import { BtnSection } from "../../../components";
import { IconSearch, IconX } from "@tabler/icons-react";

export const ReservarBusquedaClienteForm = ({
    reservaForm,
    showDetails,
    disabledInput,
    cargando,
    handleSubmitHuesped,
    handleClear,
}) => {
    return (
        <Group align="end" gap="xs">
            <TextInput
                withAsterisk
                label="Cédula"
                placeholder="Número de cédula"
                key={reservaForm.key('huesped.dni')}
                {...reservaForm.getInputProps("huesped.dni")}
                style={{ flex: 1 }}
                autoComplete="off"
                disabled={disabledInput}
            />
            <BtnSection
                variant="default"
                fontSize={12}
                heigh={34}
                fullwidth={false}
                IconSection={IconSearch}
                disabled={cargando}
                handleAction={handleSubmitHuesped}
            >
                {cargando ? "Buscando..." : "Buscar"}
            </BtnSection>
            {showDetails && (
                <Button
                    variant="light"
                    color="red"
                    leftSection={<IconX size={16} />}
                    onClick={handleClear}
                    disabled={cargando}
                >
                    Limpiar
                </Button>
            )}
        </Group>
    );
};
