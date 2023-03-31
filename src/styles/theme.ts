import { ThemeConfig, extendTheme, defineStyleConfig } from "@chakra-ui/react";
const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false
};

const Button = defineStyleConfig({
    baseStyle: {
        cursor: "pointer"
    }
});

const colors = {
    gray: {
        800: '#444654'
    }
}

export const theme = extendTheme({
    config,
    colors,
    components: {
        Button,
    }
});