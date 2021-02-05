# Location Tracker

[![GitHub package.json version](https://img.shields.io/github/package-json/v/MrF3lix/location-tracker-dashboard)](https://github.com/MrF3lix/location-tracker-dashboard)
[![GitHub](https://img.shields.io/github/license/MrF3lix/location-tracker-dashboard)]([.](https://raw.githubusercontent.com/MrF3lix/location-tracker-dashboard/master/license.txt))

![Location Tracking Dashboard Logo](./img/location-tracking-dashboard-logo.png)

A realtime tracking dashboard to visualize geo locations using firebase and GeoJSON.

View it here: [Location Tracking Dashboard](https://location-tracking-dashboard.vercel.app/)

## How it works

1. A companion app (e.g. [Location Tracker](https://github.com/MrF3lix/location-tracker)) records GPS coordinates and sends them to a Firebase Realtime Database.
2. The Dashboard then shows the recorded coordinates in real time.

![Screenshot](./img/screenshot.png)

## Why?

This project was created to showcase location tracking in a React Native app while the app is in the background or suspended.
