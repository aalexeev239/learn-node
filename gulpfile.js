"use strict";


const myDropboxPath = '../../../Dropbox/nodejs/andrey.alexeev/';
const kantorDropboxPath = '../../../Dropbox/nodejs/ilya.kantor/';
const kantorProjectPath = '_ilya.kantor/';


const gulp = require('gulp');
const path = require('path');

gulp.task('push', () => gulp.src([
        '!node_modules',
        '!node_modules/**',
        '!.idea',
        '!.idea/**',
        '!.git',
        '!.git/**',
        '!gulpfile.js',
        '!' + kantorProjectPath,
        '!' + path.join(kantorProjectPath, '**'),
        '**'
    ]).pipe(gulp.dest(myDropboxPath))
 );

gulp.task('pull', () => gulp.src([
        '!node_modules',
        '!node_modules/**',
        '!Icon?',
        '!.dropbox',
        '**'
    ], {cwd: kantorDropboxPath}).pipe(gulp.dest(kantorProjectPath)));
