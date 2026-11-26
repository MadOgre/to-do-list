import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";

import { getErrorText } from "@/api/error-text";

// The error that axios throws when the API answers with an error status and this body.
const makeAxiosError = (status: number, data: unknown) =>
  new AxiosError("Request failed", "ERR_BAD_RESPONSE", undefined, undefined, {
    status,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
    data,
  });

describe("getErrorText", () => {
  it("gives the text for the outcome in the API's error body", () => {
    const error = makeAxiosError(409, { outcome: "version_conflict", message: "todo x changed after version 1" });

    expect(getErrorText(error)).toBe("This todo changed in another tab or window. The list now shows its latest state.");
  });

  it("gives the fallback text when the response has no error body, as with a 500", () => {
    expect(getErrorText(makeAxiosError(500, { message: "Internal Server Error" }))).toBe("Could not save your change.");
  });

  it("gives the fallback text for an error that doesn't come from axios", () => {
    expect(getErrorText(new Error("something else"))).toBe("Could not save your change.");
  });
});
