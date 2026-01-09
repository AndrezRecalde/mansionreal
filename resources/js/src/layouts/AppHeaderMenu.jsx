import { useMemo } from "react";
import { AppShell } from "@mantine/core";
import { HeaderMenu } from "./HeaderMenu";
import classes from "./modules/AppBody.module.css"

export const AppHeaderMenu = ({ children }) => {
    const usuario = JSON.parse(localStorage.getItem("service_user") || "{}");

    return (
        <AppShell
            header={{ height: { base: 48, sm: 60, lg: 60 } }}
            padding={30}
        >
            <AppShell.Header>
                <HeaderMenu usuario={usuario} />
            </AppShell.Header>
            {/* <AppShell.Navbar p="md">
                Navbar
                {Array(15)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} h={28} mt="sm" animate={false} />
                    ))}
            </AppShell.Navbar> */}
            <AppShell.Main className={classes.body}>{children}</AppShell.Main>
            {/* <AppShell.Footer p="md">Footer</AppShell.Footer> */}
        </AppShell>
    );
};
