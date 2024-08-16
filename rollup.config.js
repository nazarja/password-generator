import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/ts/index.ts', // Your entry file
  output: [
    {
      file: 'dist/js/index.js', // Output file
      format: 'umd', // UMD format
    }
  ],
  plugins: [typescript(), commonjs(), resolve()],
};