// https://auth0.com/docs/secure/security-guidance/data-security/token-storage#browser-in-memory-scenarios
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#emulating_private_methods_with_closures

const Storage = () => {
  let token: string | null = null;

  function changeValue(value: string | null) {
    token = value;
  }

  return {
    set: (value: string | null) => changeValue(value),
    get: () => token,
  };
};

export const TokenStorage = Storage();
