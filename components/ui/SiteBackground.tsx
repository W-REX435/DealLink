/**
 * Fixed full-screen background texture behind the whole site.
 * Switches between light/dark artwork automatically via the `.dark` class.
 */
export default function SiteBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <img
        src="/bg/landing-light.webp"
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px] dark:hidden"
      />
      <img
        src="/bg/landing-dark.webp"
        alt=""
        className="absolute inset-0 hidden h-full w-full scale-105 object-cover blur-[2px] dark:block"
      />
    </div>
  );
}
