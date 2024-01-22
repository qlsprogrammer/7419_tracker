import ThemeProvider from "@/lib/theme.context";
import { CssBaseline } from "@material-ui/core";
import { SessionProvider } from "next-auth/react";
import { CacheProvider, EmotionCache } from '@emotion/react';

import { AppProps } from "next/app";
import { useEffect } from "react";

import createCache from '@emotion/cache';

// prepend: true moves MUI styles to the top of the <head> so they're loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const App = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);
  return (
    <CacheProvider value={emotionCache}>
    <ThemeProvider>
      <SessionProvider session={pageProps.session}>
        <CssBaseline />
        <Component {...pageProps} />
      </SessionProvider>
    </ThemeProvider>
</CacheProvider>
  );
};

export default App;
