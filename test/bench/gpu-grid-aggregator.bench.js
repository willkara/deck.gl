// Copyright (c) 2015 - 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* eslint-disable no-console, no-invalid-this */
// TODO: remove hard path once @deck.gl/experimental-layers published with GPUScreenGridLayer
import GPUGridAggregator from '@deck.gl/experimental-layers/utils/gpu-grid-aggregator';
import {gl} from '@deck.gl/test-utils';
import {GridAggregationData} from 'deck.gl/test/data';

const {fixture, generateRandomGridPoints} = GridAggregationData;
const aggregator = new GPUGridAggregator(gl);
const changeFlags = {dataChanged: true};
const positions1K = generateRandomGridPoints(1000);
const positions100K = generateRandomGridPoints(100000);
const positions1M = generateRandomGridPoints(1000000);

export default function gridAggregatorBench(suite) {
  return suite
    .group('GRID AGGREGATION')
    .add('CPU 1K', () => {
      runAggregation({useGPU: false, positions: positions1K});
    })
    .add('GPU 1K', () => {
      runAggregation({useGPU: true, positions: positions1K});
    })
    .add('CPU 100K', () => {
      runAggregation({useGPU: false, positions: positions100K});
    })
    .add('GPU 100K', () => {
      runAggregation({useGPU: true, positions: positions100K});
    })
    .add('CPU 1M', () => {
      runAggregation({useGPU: false, positions: positions1M});
    })
    .add('GPU 1M', () => {
      runAggregation({useGPU: true, positions: positions1M});
    });
}

function runAggregation(opts) {
  const results = aggregator.run(Object.assign({}, fixture, {changeFlags}, opts));
  if (opts.useGPU) {
    // Call getData to sync GPU and CPU.
    results.countsBuffer.getData();
    results.maxCountBuffer.getData();
  }
}
