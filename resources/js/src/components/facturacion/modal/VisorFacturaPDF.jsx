import { Modal, Box, Group, Button, Loader, Center } from "@mantine/core";
import { IconDownload, IconX } from "@tabler/icons-react";
import { useState, useEffect } from "react";

export const VisorFacturaPDF = ({
    opened,
    onClose,
    pdfUrl,
    facturaNumero,
    onDownload,
}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (opened) {
            setLoading(true);
        }
    }, [opened]);

    const handleLoad = () => {
        setLoading(false);
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={`Factura ${facturaNumero}`}
            size="xl"
            fullScreen
            padding={0}
        >
            <Box style={{ height: "calc(100vh - 60px)", position: "relative" }}>
                {loading && (
                    <Center style={{ height: "100%" }}>
                        <Loader size="lg" />
                    </Center>
                )}

                <iframe
                    src={pdfUrl}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        display: loading ? "none" : "block",
                    }}
                    title={`Factura ${facturaNumero}`}
                    onLoad={handleLoad}
                />

                <Group
                    style={{
                        position: "absolute",
                        bottom: 20,
                        right: 20,
                        gap: 10,
                    }}
                >
                    <Button
                        leftSection={<IconDownload size={16} />}
                        onClick={onDownload}
                        color="teal"
                    >
                        Descargar PDF
                    </Button>
                    <Button
                        leftSection={<IconX size={16} />}
                        onClick={onClose}
                    >
                        Cerrar
                    </Button>
                </Group>
            </Box>
        </Modal>
    );
};
