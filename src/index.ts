import "frida-il2cpp-bridge";
import { sleep, getActivity, ensureModuleInit, JavaIl2CppPerform } from "./util.js";

console.log("Frida Loaded");

const APP_MAIN_ACTIVITY = "com.sybogames.chili.multidex.ChiliMultidexSupportActivity";

const modules = ["libil2cpp.so", "libunity.so", "libmain.so"];

JavaIl2CppPerform(async () => {
  await sleep(1000);

  const mainActivity = await getActivity(APP_MAIN_ACTIVITY);
  if (!mainActivity) throw new Error("Failed to get main activity");

  main(mainActivity).catch((error) => console.error(error));
});

async function main(mainActivity: Java.Wrapper) {
  const AssemblyCSharp = Il2Cpp.domain.assembly("Assembly-CSharp").image;
  type Il2CppThis = Il2Cpp.Object | Il2Cpp.Class | Il2Cpp.ValueType;

  // Menu
  const Config = Java.use("com.maars.fmenu.Config");
  const Menu = Java.use("com.maars.fmenu.Menu");
  const Bool = Java.use("com.maars.fmenu.PBoolean");
  const Int = Java.use("com.maars.fmenu.PInteger");
  const Color = Java.use("android.graphics.Color");

  const enable = Bool.of(false);
  const currencyAmount = Int.of(-1);
  const disableCollision = Bool.of(false);
  const infJumps = Bool.of(false);
  const scoreMultiplier = Int.of(-1);
  const flashMode = Bool.of(false);

  let UnloadRunnable = Java.registerClass({
    name: "com.example.UnloadMod",
    implements: [Java.use("java.lang.Runnable")],
    methods: {
      run: function () {
        enable.set(false);
        menu.detach();
        console.log("Unloaded Mod")
      }
    }
  });

  const unloadRunnable = UnloadRunnable.$new();

  const menuConfig = Config.$new();
  menuConfig.MENU_TITLE.value = "SigmaMod by rdbo";
  menuConfig.MENU_SUBTITLE.value = "Subway Surfers Mod Menu - https://github.com/rdbo";
  menuConfig.MENU_BG_COLOR.value = Color.parseColor("#101a20");
  menuConfig.TEXT_COLOR_PRIMARY.value = Color.parseColor("#00ffc8");
  menuConfig.TEXT_COLOR_SECONDARY.value = Color.parseColor("#ffffff");
  menuConfig.MENU_LAUNCHER_ICON.value = "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";

  const menu = Menu.$new(mainActivity, menuConfig);
  menu.Switch("Enable", enable);
  menu.InputNum("Currency Ammount", currencyAmount);
  menu.InputNum("Score Multiplier", scoreMultiplier);
  menu.Switch("Disable Collision", disableCollision);
  menu.Switch("Infinite Jumps", infJumps);
  menu.Switch("Flash Mode", flashMode);
  menu.ButtonAction("Unload Mod", unloadRunnable);

  // Hooks

  // Currency Changer
  const WalletModel = AssemblyCSharp.class("SYBO.Subway.Meta.WalletModel");
  WalletModel.method("GetCurrency").implementation = function (
    this: Il2CppThis,
    currencyType: any
  ) : number {
    if (enable && currencyAmount.get() >= 0) return currencyAmount.get();
    return this.method<number>("GetCurrency").invoke(currencyType);
  };

  // No Collision
  const CharacterMotor = AssemblyCSharp.class("SYBO.RunnerCore.Character.CharacterMotor");
  CharacterMotor.method("CheckFrontalImpact").implementation = function (this: Il2CppThis, impactState: any) : boolean {
    if (enable.get() && disableCollision.get()) return false;
    return this.method<boolean>("CheckFrontalImpact").invoke(impactState);
  };

  CharacterMotor.method("CheckSideImpact").implementation = function (this: Il2CppThis, impactState: any) : boolean {
    if (enable.get() && disableCollision.get()) return false;
    return this.method<boolean>("CheckSideImpact").invoke(impactState);
  };

  // Infinite Jump
  CharacterMotor.method("get_CanJump").implementation = function (this: Il2CppThis) {
    if (enable.get() && infJumps.get()) return true;
    return this.method<boolean>("get_CanJump").invoke();
  };

  // Score Multiplier
  const ScoreMultiplierManager = AssemblyCSharp.class("SYBO.Subway.ScoreMultiplierManager");
  ScoreMultiplierManager.method("get_BaseMultiplierSum").implementation = function () {
    if (enable.get() && scoreMultiplier.get() >= 0) return scoreMultiplier.get();
    return this.method<number>("get_BaseMultiplierSum").invoke();
  };

  // Flash Mode
  const CMA = AssemblyCSharp.class("SYBO.RunnerCore.Character.CharacterMotorAbilities");
  CMA.method("get_MinSpeed").implementation = function () {
    if (enable.get() && flashMode.get()) return 2000;
    return this.method<number>("get_MinSpeed").invoke();
  };

  CMA.method("get_LaneChangeDuration").implementation = function () {
    if (enable.get() && flashMode.get()) return 0.005;
    return this.method<number>("get_LaneChangeDuration").invoke();
  };

  CMA.method("get_DiveSpeed").implementation = function () {
    if (enable.get() && flashMode.get()) return -500;
    return this.method<number>("get_DiveSpeed").invoke();
  }

  // Attach Menu
  Java.scheduleOnMainThread(() => {
    menu.attach();
  });
}

console.log("Frida Initialized");