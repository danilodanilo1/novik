import { StyleSheet } from "@react-pdf/renderer";

export type CvPdfTheme = "dark" | "print";

type CvPdfPalette = {
  bg: string;
  surface: string;
  red: string;
  redMuted: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  textFaint: string;
  border: string;
  link: string;
};

const darkPalette: CvPdfPalette = {
  bg: "#050505",
  surface: "#0a0a0a",
  red: "#DC2626",
  redMuted: "#991B1B",
  text: "#FFFFFF",
  textMuted: "#D4D4D8",
  textSubtle: "#A1A1AA",
  textFaint: "#71717A",
  border: "#27272A",
  link: "#D4D4D8",
};

const printPalette: CvPdfPalette = {
  bg: "#FFFFFF",
  surface: "#F4F4F5",
  red: "#DC2626",
  redMuted: "#FEE2E2",
  text: "#09090B",
  textMuted: "#3F3F46",
  textSubtle: "#52525B",
  textFaint: "#71717A",
  border: "#E4E4E7",
  link: "#18181B",
};

export function getCvPdfPalette(theme: CvPdfTheme): CvPdfPalette {
  return theme === "print" ? printPalette : darkPalette;
}

export function createCvPdfStyles(theme: CvPdfTheme) {
  const c = getCvPdfPalette(theme);

  return StyleSheet.create({
    page: {
      backgroundColor: c.bg,
      color: c.text,
      fontFamily: "Helvetica",
      fontSize: 9,
      paddingTop: 32,
      paddingBottom: 36,
      paddingHorizontal: 44,
      position: "relative",
    },
    accentBar: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 5,
      backgroundColor: c.red,
    },
    topStripe: {
      position: "absolute",
      top: 0,
      left: 5,
      right: 0,
      height: 3,
      backgroundColor: c.redMuted,
    },
    header: {
      marginBottom: 14,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    identityBlock: {
      marginBottom: 10,
    },
    eyebrow: {
      fontFamily: "Helvetica-Bold",
      fontSize: 7,
      lineHeight: 1.6,
      letterSpacing: 2.5,
      color: c.red,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    name: {
      fontFamily: "Helvetica-Bold",
      fontSize: 24,
      lineHeight: 1.25,
      letterSpacing: -0.3,
      marginBottom: 6,
      color: c.text,
    },
    role: {
      fontSize: 11,
      lineHeight: 1.5,
      color: c.textMuted,
      marginBottom: 10,
    },
    contactBlock: {
      marginBottom: 2,
    },
    contactLine: {
      fontSize: 8,
      lineHeight: 1.6,
      color: c.textSubtle,
      marginBottom: 3,
    },
    contactLink: {
      color: c.link,
      textDecoration: "none",
    },
    statsRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 12,
    },
    statBox: {
      flex: 1,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderLeftWidth: 3,
      borderLeftColor: c.red,
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    statValue: {
      fontFamily: "Helvetica-Bold",
      fontSize: 13,
      lineHeight: 1.3,
      color: c.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 6.5,
      lineHeight: 1.5,
      letterSpacing: 1.2,
      color: c.textFaint,
      textTransform: "uppercase",
    },
    sectionTitle: {
      fontFamily: "Helvetica-Bold",
      fontSize: 7,
      lineHeight: 1.6,
      letterSpacing: 2.2,
      color: c.red,
      textTransform: "uppercase",
      marginTop: 12,
      marginBottom: 8,
    },
    continuationLabel: {
      fontFamily: "Helvetica-Bold",
      fontSize: 7,
      lineHeight: 1.6,
      letterSpacing: 1.5,
      color: c.textFaint,
      textTransform: "uppercase",
      marginBottom: 10,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    summary: {
      fontSize: 9,
      lineHeight: 1.55,
      color: c.textMuted,
      marginBottom: 8,
    },
    tagline: {
      fontSize: 8.5,
      lineHeight: 1.5,
      color: c.textFaint,
      fontStyle: "italic",
    },
    job: {
      marginBottom: 12,
      paddingLeft: 10,
      borderLeftWidth: 2,
      borderLeftColor: c.border,
    },
    jobHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 5,
      gap: 10,
    },
    jobRole: {
      flex: 1,
      fontFamily: "Helvetica-Bold",
      fontSize: 10.5,
      lineHeight: 1.4,
      color: c.text,
    },
    jobPeriod: {
      fontFamily: "Helvetica-Bold",
      fontSize: 7,
      lineHeight: 1.5,
      letterSpacing: 1,
      color: c.red,
      textTransform: "uppercase",
    },
    jobCompany: {
      fontSize: 9,
      lineHeight: 1.45,
      color: c.textSubtle,
      marginBottom: 3,
    },
    jobAudience: {
      fontFamily: "Helvetica-Bold",
      fontSize: 7,
      lineHeight: 1.5,
      letterSpacing: 1,
      color: c.red,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    jobLocation: {
      fontSize: 7.5,
      lineHeight: 1.5,
      color: c.textFaint,
      marginBottom: 6,
    },
    jobDescription: {
      fontSize: 8.5,
      lineHeight: 1.55,
      color: c.textMuted,
      marginBottom: 6,
    },
    highlightRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 4,
      paddingLeft: 2,
    },
    bullet: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.red,
      marginTop: 4,
      marginRight: 6,
    },
    highlightText: {
      flex: 1,
      fontSize: 8,
      lineHeight: 1.5,
      color: c.textMuted,
    },
    toolsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
      marginTop: 6,
    },
    toolPill: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      paddingVertical: 4,
      paddingHorizontal: 6,
      borderRadius: 10,
    },
    toolText: {
      fontSize: 6.5,
      lineHeight: 1.4,
      letterSpacing: 0.8,
      color: c.textSubtle,
      textTransform: "uppercase",
    },
    twoCol: {
      flexDirection: "row",
      gap: 16,
      marginTop: 4,
    },
    col: {
      flex: 1,
    },
    brandGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 8,
    },
    brandPill: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      paddingVertical: 5,
      paddingHorizontal: 8,
    },
    brandText: {
      fontFamily: "Helvetica-Bold",
      fontSize: 7,
      lineHeight: 1.4,
      letterSpacing: 1,
      color: c.textMuted,
    },
    skillCategory: {
      marginBottom: 8,
    },
    skillCategoryTitle: {
      fontFamily: "Helvetica-Bold",
      fontSize: 8,
      lineHeight: 1.4,
      color: c.text,
      marginBottom: 5,
    },
    langRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 6,
      paddingBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    langName: {
      fontSize: 8.5,
      lineHeight: 1.4,
      color: c.textMuted,
    },
    langLevel: {
      fontSize: 8,
      lineHeight: 1.4,
      color: c.textFaint,
    },
    availabilityBox: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      padding: 10,
      marginTop: 8,
    },
    availabilityRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    availabilityLabel: {
      fontSize: 7,
      lineHeight: 1.4,
      letterSpacing: 1,
      color: c.textFaint,
      textTransform: "uppercase",
    },
    availabilityValue: {
      fontFamily: "Helvetica-Bold",
      fontSize: 8,
      lineHeight: 1.4,
      color: c.textMuted,
    },
    footer: {
      position: "absolute",
      bottom: 16,
      left: 44,
      right: 44,
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: c.border,
      paddingTop: 6,
    },
    footerText: {
      fontSize: 6.5,
      lineHeight: 1.4,
      color: c.textFaint,
      letterSpacing: 0.5,
    },
  });
}

export type CvPdfStyles = ReturnType<typeof createCvPdfStyles>;
