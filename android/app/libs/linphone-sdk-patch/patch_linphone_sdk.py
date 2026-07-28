#!/usr/bin/env python3
"""Patches a linphone-sdk-android .aar to compile under this project's old
AGP 7.0.3 / D8 toolchain.

Why this exists: every linphone-sdk-android release with 16KB-page-aligned
native libraries (needed for current Android hardware — see README.md in
this directory) also ships a classes.jar compiled to Java 17 bytecode
(class file major version 61), which this project's D8 dexer rejects
outright ("Unsupported class file major version 61"). Upgrading this
project's AGP to a version whose D8 accepts Java 17 bytecode is a much
larger, riskier change (AGP 8.x requires Gradle 8, a namespace declaration
in every module including old unmaintained third-party RN native modules,
and possibly a React Native upgrade) than is justified for what turns out
to be a cosmetic difference: the actual .class files don't use any Java 9+
*bytecode-level* feature that D8 can't already handle (verified empirically
— see README.md) — the version marker is just an artifact of Linphone's own
build toolchain having moved to a JDK 17 compiler. This script rewrites
that marker back to 52 (Java 8, the same version 5.2.112's classes.jar
already used, and which is known to dex cleanly here) without touching the
actual bytecode instructions.

Usage:
    python3 patch_linphone_sdk.py <input.aar> <output.aar>
"""
import struct
import sys
import zipfile

JAVA_8_MAJOR = 52
CLASS_MAGIC = b"\xca\xfe\xba\xbe"


def patch_classes_jar(jar_bytes: bytes) -> bytes:
    import io

    src = io.BytesIO(jar_bytes)
    dst = io.BytesIO()
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename.endswith(".class") and data[:4] == CLASS_MAGIC:
                major = struct.unpack_from(">H", data, 6)[0]
                if major > JAVA_8_MAJOR:
                    data = data[:6] + struct.pack(">H", JAVA_8_MAJOR) + data[8:]
            zout.writestr(item, data)
    return dst.getvalue()


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    in_path, out_path = sys.argv[1], sys.argv[2]

    with zipfile.ZipFile(in_path) as zin:
        names = zin.namelist()
        if "classes.jar" not in names:
            print("classes.jar not found in AAR — is this really a linphone-sdk-android .aar?")
            sys.exit(1)

        with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                data = zin.read(item.filename)
                if item.filename == "classes.jar":
                    data = patch_classes_jar(data)
                zout.writestr(item, data)

    print(f"Patched AAR written to {out_path}")


if __name__ == "__main__":
    main()
