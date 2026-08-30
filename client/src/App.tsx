import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./i18n/LanguageProvider";
import Home from "./pages/Home";
import { LANGS, type Lang } from "@shared/i18n";

/** Slovak keeps the root: the site already runs there and moving it would break every existing link. */
function Localised({ lang }: { lang: Lang }) {
  return (
    <LanguageProvider lang={lang}>
      <Home />
    </LanguageProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Localised lang="sk" />} />
      {LANGS.filter((lang) => lang !== "sk").flatMap((lang) => [
        <Route
          key={lang}
          path={`/${lang}`}
          component={() => <Localised lang={lang} />}
        />,
        <Route
          key={`${lang}-slash`}
          path={`/${lang}/`}
          component={() => <Localised lang={lang} />}
        />,
      ])}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
