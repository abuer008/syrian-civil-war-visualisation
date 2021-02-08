import { createMuiTheme } from "@material-ui/core/styles";
import 'typeface-open-sans';
import 'typeface-ubuntu';

export const theme = createMuiTheme({
    typography: [
        'Open Sans', 'Ubuntu'
    ].join(',')
})