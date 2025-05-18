import useSWR, { SWRConfig } from "swr";

export const swrConfig = {
  /**
   * `refreshInterval`:
   * Time in milliseconds that determines how often data will be automatically refreshed.
   * Set this to `0` to disable polling.
   */
  refreshInterval: 60000 * 10, // Refresh every 60 seconds.

  /**
   * `dedupingInterval`:
   * Time interval in milliseconds to prevent deduplication of requests.
   * SWR will avoid making duplicate requests during this time interval.
   * Default is 2000ms (2 seconds).
   */
  dedupingInterval: 3000, // Deduplicate requests for 3 seconds.

  /**
   * `revalidateOnFocus`:
   * When true, SWR will re-fetch data when the window is focused.
   * Useful when you want to ensure data is refreshed when users return to the app.
   */
  revalidateOnFocus: true, // Refresh data when the tab is focused.

  /**
   * `revalidateOnReconnect`:
   * When true, SWR will re-fetch data when the network reconnects.
   * Useful for apps that need fresh data after going offline and coming back online.
   */
  revalidateOnReconnect: true, // Refresh data after network reconnects.

  /**
   * `shouldRetryOnError`:
   * If true, SWR will retry fetching the data on errors.
   * Set it to `false` if you don't want automatic retries on error.
   */
  shouldRetryOnError: false, // Retry fetching on error.

  /**
   * `errorRetryCount`:
   * Number of retries before failing when an error occurs during the fetch.
   * Default is 3 retries.
   */
  errorRetryCount: 1, // Retry up to 3 times on error.

  /**
   * `errorRetryInterval`:
   * Time interval (in ms) between retry attempts on errors.
   * Default is 5000ms (5 seconds).
   */
  errorRetryInterval: 2000, // Retry after 2 seconds.

  /**
   * `revalidateOnMount`:
   * When true, SWR will re-fetch the data when the component is mounted.
   */
  revalidateOnMount: true, // Re-fetch data when the component mounts.

  /**
   * `keepPreviousData`:
   * If true, SWR will retain the previous data while fetching new data.
   * Useful to prevent UI flickering during transitions.
   */
  keepPreviousData: true, // Keep previous data when loading new data.

  /**
   * `focusThrottleInterval`:
   * Time interval in milliseconds between revalidation requests when the window regains focus.
   * This prevents redundant requests when the user switches between tabs.
   */
  focusThrottleInterval: 5000, // Throttle re-fetch to every 5 seconds on focus.

  /**
   * `isPaused`:
   * A function that can be used to pause data fetching based on certain conditions (e.g., based on user input).
   * If it returns `true`, the data fetch will be paused.
   */
  isPaused: () => false, // Disable pausing (returns false).

  /**
   * `timeout`:
   * You can use this to define a timeout for requests. SWR will automatically cancel requests that exceed this time.
   */
  timeout: 30000, // Timeout after 30 seconds.

  /**
   * `swr` (customized SWR instance):
   * You can configure multiple SWR instances if you want custom behavior for different data fetchers.
   * This allows for fine-grained control over each API or data request.
   */
  //   swr: useSWR, // Default SWR instance, or use a custom one.

  /**
   * `cache`:
   * SWR can be configured with a custom cache to store data, allowing it to persist even after page reloads.
   * By default, SWR uses an in-memory cache.
   */
  //   cache: new Map(), // Use a custom cache (e.g., in-memory or localStorage).
};
