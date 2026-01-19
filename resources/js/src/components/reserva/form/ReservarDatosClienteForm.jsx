import {
    Collapse,
    Group,
    Loader,
    rem,
    SimpleGrid,
    TextInput,
    Transition,
} from "@mantine/core";
import { useHuespedStore } from "../../../hooks";

export const ReservarDatosClienteForm = ({
    reservaForm,
    showDetails,
    disabledInput,
    labelStyles,
}) => {
    const { cargando } = useHuespedStore();

    return (
        <Transition
            mounted={showDetails || cargando}
            transition="slide-up"
            duration={350}
            timingFunction="ease"
        >
            {(styles) => (
                <div style={styles}>
                    <Collapse in={showDetails || cargando}>
                        <div>
                            {cargando ? (
                                <Group
                                    align="center"
                                    justify="center"
                                    style={{ minHeight: rem(120) }}
                                >
                                    <Loader size="lg" />
                                </Group>
                            ) : (
                                <SimpleGrid
                                    cols={{
                                        base: 1,
                                        xs: 1,
                                        sm: 1,
                                        md: 2,
                                        lg: 2,
                                    }}
                                    spacing="md"
                                >
                                    <TextInput
                                        withAsterisk
                                        disabled={disabledInput}
                                        label="Nombre Completo"
                                        placeholder="Nombre completo del huésped"
                                        key={reservaForm.key(
                                            "huesped.nombres_completos",
                                        )}
                                        {...reservaForm.getInputProps(
                                            "huesped.nombres_completos",
                                        )}
                                        classNames={labelStyles}
                                    />
                                    <TextInput
                                        disabled={disabledInput}
                                        label="Teléfono"
                                        placeholder="Teléfono"
                                        key={reservaForm.key(
                                            "huesped.telefono",
                                        )}
                                        {...reservaForm.getInputProps(
                                            "huesped.telefono",
                                        )}
                                        classNames={labelStyles}
                                    />
                                    <TextInput
                                        disabled={disabledInput}
                                        label="Correo"
                                        placeholder="Correo"
                                        key={reservaForm.key("huesped.correo")}
                                        {...reservaForm.getInputProps(
                                            "huesped.email",
                                        )}
                                        classNames={labelStyles}
                                        style={{ gridColumn: "span 2" }}
                                    />
                                </SimpleGrid>
                            )}
                        </div>
                    </Collapse>
                </div>
            )}
        </Transition>
    );
};
