import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.DecimalFormat;
import java.util.Arrays;
import java.util.Objects;

/**
 * A class that provides methods for loading and searching pi
 * and organizing results.
 */
public class PiSearcher {
    private static final char[] PI = new char[1000000000];

    /**
     * Loads 1 billion digits from a file into the PI char array.
     */
    public static void loadPi()
    {
        int actualBuffered = 0;
        System.out.println("Loading Pi...");
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(
                    Objects.requireNonNull(
                            PiSearcher.class.getResourceAsStream("pi.txt")
                    )
            ));
            actualBuffered = br.read(PI, 0, 1000000000);
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println("Loaded " + actualBuffered + " digits");
    }

    /**
     * Generates a human-readable output denoting the substring's location.
     *
     * @param index The start index of the substring.
     * @param length The length of the substring.
     * @return The human-readable output.
     */
    public static String generateOutput(int index, int length) {
        int startPos = Math.max(index - 8, 0);
        int endPos = Math.min(index + length + 8, 999999999);
        int count = endPos - startPos + 1;
        DecimalFormat df = new DecimalFormat("#,###");
        boolean firstEllipsis = startPos != 0;
        int localStartPos = index - startPos;
        String firstSpacing = " ".repeat(localStartPos + (firstEllipsis ? 3 : 0));
        String startStr = df.format(index - 1); // correct for "3." by subtracting 2
        String endStr = df.format(index + length - 2);
        String mainPart = new String(PI, startPos, count);
        String mainMarked = mainPart.substring(0, localStartPos) + "<mark>" +
                mainPart.substring(localStartPos, localStartPos + length) + "</mark>" +
                mainPart.substring(localStartPos + length);

        if (length > 1) {
            String midSpacing = " ".repeat(length - 2);
            int adjustedMidCount = midSpacing.length() - startStr.length() + 1;
            String adjustedMidSection = (adjustedMidCount >= 0) ? " ".repeat(adjustedMidCount) + "|" : "";

            return (firstEllipsis ? "..." : "") + mainMarked + (endPos != 999999999 ? "..." : "") + "\n" +
                    firstSpacing + "^" + midSpacing + "^\n" +
                    firstSpacing + "|" + midSpacing + "|\n" +
                    firstSpacing + startStr + adjustedMidSection + "\n" +
                    firstSpacing + " " + midSpacing + endStr + "\n\n" +
                    "The sequence first occurs from the " + startStr + ordinal(index - 1) +
                    " to the " + endStr + ordinal(index + length - 2) + " decimal place.";
        } else {
            return (firstEllipsis ? "..." : "") + mainMarked + (endPos != 999999999 ? "..." : "") + "\n" +
                    firstSpacing + "^\n" +
                    firstSpacing + "|\n" +
                    firstSpacing + startStr + "\n\n" +
                    "The number first occurs at the " + startStr + ordinal(index - 1) + " decimal place.";
        }
    }

    /**
     * Returns the abbreviated ordinal suffix of a number.
     */
    private static String ordinal(int i) {
        String[] suffixes = new String[] { "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th" };
        return switch (i % 100) {
            case 11, 12, 13 -> "th";
            default -> suffixes[i % 10];
        };
    }

    /**
     * Returns the index within this string of the first occurrence of the
     * specified substring. If it is not a substring, return -1.
     *
     * There is no Galil because it only generates one match.
     *
     * Boyer-Moore implementation adapted from
     * https://en.wikipedia.org/wiki/Boyer%E2%80%93Moore_string-search_algorithm
     *
     * @param needle The target string to search.
     * @return The start index of the substring.
     */
    public static int indexOf(char[] needle) {
        if (needle.length == 0) {
            return 0;
        }
        int[] charTable = makeCharTable(needle);
        int[] offsetTable = makeOffsetTable(needle);
        for (int i = needle.length - 1, j; i < PI.length;) {
            for (j = needle.length - 1; needle[j] == PI[i]; --i, --j) {
                if (j == 0) {
                    return i;
                }
            }
            // i += needle.length - j; // For naive method
            i += Math.max(offsetTable[needle.length - 1 - j], charTable[PI[i]]);
        }
        return -1;
    }

    /**
     * Makes the jump table based on the mismatched character information.
     */
    private static int[] makeCharTable(char[] needle) {
        final int ALPHABET_SIZE = Character.MAX_VALUE + 1; // 65536
        int[] table = new int[ALPHABET_SIZE];
        Arrays.fill(table, needle.length);
        for (int i = 0; i < needle.length; ++i) {
            table[needle[i]] = needle.length - 1 - i;
        }
        return table;
    }

    /**
     * Makes the jump table based on the scan offset which mismatch occurs.
     * (bad character rule).
     */
    private static int[] makeOffsetTable(char[] needle) {
        int[] table = new int[needle.length];
        int lastPrefixPosition = needle.length;
        for (int i = needle.length; i > 0; --i) {
            if (isPrefix(needle, i)) {
                lastPrefixPosition = i;
            }
            table[needle.length - i] = lastPrefixPosition - i + needle.length;
        }
        for (int i = 0; i < needle.length - 1; ++i) {
            int slen = suffixLength(needle, i);
            table[slen] = needle.length - 1 - i + slen;
        }
        return table;
    }

    /**
     * Is needle[p:end] a prefix of needle?
     */
    private static boolean isPrefix(char[] needle, int p) {
        for (int i = p, j = 0; i < needle.length; ++i, ++j) {
            if (needle[i] != needle[j]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns the maximum length of the substring ends at p and is a suffix.
     * (good suffix rule)
     */
    private static int suffixLength(char[] needle, int p) {
        int len = 0;
        for (int i = p, j = needle.length - 1;
             i >= 0 && needle[i] == needle[j]; --i, --j) {
            len += 1;
        }
        return len;
    }
}
