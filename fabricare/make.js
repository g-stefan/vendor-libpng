// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("vendor");

messageAction("make");

if (!Shell.directoryExists("source")) {
	exitIf(Shell.system("7z x -aoa archive/" + Project.vendor + ".7z"));
	Shell.rename(Project.vendor, "source");
};

Shell.mkdirRecursivelyIfNotExists("output");
Shell.mkdirRecursivelyIfNotExists("output/bin");
Shell.mkdirRecursivelyIfNotExists("output/include");
Shell.mkdirRecursivelyIfNotExists("output/lib");
Shell.mkdirRecursivelyIfNotExists("temp");

Shell.copyFile("source/scripts/pnglibconf.h.prebuilt", "source/pnglibconf.h");

Shell.mkdirRecursivelyIfNotExists("output/include");
Shell.copyFile("source/pngconf.h", "output/include/pngconf.h");
Shell.copyFile("source/pnglibconf.h", "output/include/pnglibconf.h");
Shell.copyFile("source/png.h", "output/include/png.h");
Shell.copyFile("source/pnginfo.h", "output/include/pnginfo.h");
Shell.copyFile("source/pngstruct.h", "output/include/pngstruct.h");



global.xyoCCExtra = function () {
	arguments.push(

		"--inc=output/include",
		"--use-lib-path=output/lib",
		"--rc-inc=output/include",

		"--inc=" + pathRepository + "/include",
		"--use-lib-path=" + pathRepository + "/lib",
		"--rc-inc=" + pathRepository + "/include"

	);
	return arguments;
};

var compileProject = {
	"project": "libpng",
	"includePath": [
		"output/include",
		"source",
	],
	"cSource": [
		"source/png.c",
		"source/pngerror.c",
		"source/pngget.c",
		"source/pngmem.c",
		"source/pngpread.c",
		"source/pngread.c",
		"source/pngrio.c",
		"source/pngrtran.c",
		"source/pngrutil.c",
		"source/pngset.c",
		"source/pngtrans.c",
		"source/pngwio.c",
		"source/pngwrite.c",
		"source/pngwtran.c",
		"source/pngwutil.c"
	],
	"linkerDefinitionsFile": "fabricare/source/symbols.def",
	"resources": {
		"includePath": ["source"],
		"rcSource": ["source/scripts/pngwin.rc"]
	},
	"library": ["libz"]
};

Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
if (Fabricare.isStatic()) {
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--lib", "--output-lib-path=output/lib")));
};
if (Fabricare.isDynamic()) {
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--dll", "--output-bin-path=output/bin", "--output-lib-path=output/lib")));
};

var compileProject = {
	"project": "pngtest",
	"includePath": [
		"output/include",
		"source"
	],
	"cSource": ["source/pngtest.c"],
	"library": [
		"libpng",
		"libz"
	]
};

Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--exe", "--output-bin-path=output/bin")));
