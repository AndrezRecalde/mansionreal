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
        <Group align="end" gap="xs" mb={15}>
            <TextInput
                withAsterisk
                label="Cédula"
                placeholder="Número de cédula"
                key={reservaForm.key("huesped.dni")}
                {...reservaForm.getInputProps("huesped.dni")}
                style={{ flex: 1 }}
                autoComplete="off"
                disabled={disabledInput}
            />
            <BtnSection
                variant="default"
                fontSize={12}
                heigh={34}
                IconSection={IconSearch}
                disabled={cargando}
                handleAction={(e) => handleSubmitHuesped(e)}
            >
                {cargando ? "Buscando..." : "Buscar"}
            </BtnSection>
            {showDetails && (
                <BtnSection
                    variant="light"
                    fontSize={12}
                    heigh={34}
                    color="red"
                    IconSection={IconX}
                    handleAction={handleClear}
                    disabled={cargando}
                >
                    Limpiar
                </BtnSection>
            )}
        </Group>
    );
};
