export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getActivity(activityName: string) {
  let activity;
  
  Java.choose(activityName, {
    onMatch: function (instance) {
      activity = instance;
    },

    onComplete: function () { }
  });

  return Promise.resolve(activity as unknown as Java.Wrapper);
}

export async function ensureModuleInit(...modules: string[]) {
  while (modules.length > 0) {
    const md = modules.pop() as string;

    if (!Module.getBaseAddress(md)) {
      console.log(`Waiting for ${md} to initialize...`);
      await sleep(500);
      modules.push(md);
    }
  }
}

export function JavaIl2CppPerform(fn : () => void) {
  Java.perform(() => {
    Il2Cpp.perform(fn)
  })
}