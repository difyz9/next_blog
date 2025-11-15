// src/components/EnhancedCodeBlock.tsx
'use client';

import { useEffect } from 'react';

export default function EnhancedCodeBlock() {
  useEffect(() => {
    // 为所有代码块添加复制按钮
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre || pre.querySelector('.copy-button')) return;

      // 创建复制按钮容器
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity';
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors flex items-center gap-2';
      copyButton.innerHTML = `
        <svg class="copy-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span class="copy-text">复制</span>
      `;

      copyButton.addEventListener('click', async () => {
        const code = codeBlock.textContent || '';
        try {
          await navigator.clipboard.writeText(code);
          
          // 更新按钮状态
          copyButton.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>已复制</span>
          `;
          copyButton.className = 'copy-button px-3 py-1.5 bg-green-600 text-white text-sm rounded flex items-center gap-2';
          
          setTimeout(() => {
            copyButton.innerHTML = `
              <svg class="copy-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span class="copy-text">复制</span>
            `;
            copyButton.className = 'copy-button px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors flex items-center gap-2';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });

      buttonContainer.appendChild(copyButton);
      
      // 添加 group 类以支持悬停效果
      pre.classList.add('group', 'relative');
      pre.appendChild(buttonContainer);

      // 检测语言并添加标签
      const className = codeBlock.className;
      const languageMatch = className.match(/language-(\w+)/);
      if (languageMatch) {
        const language = languageMatch[1];
        const languageLabel = document.createElement('div');
        languageLabel.className = 'absolute top-0 left-4 px-3 py-1 bg-gray-700 text-gray-300 text-xs font-mono rounded-b select-none';
        languageLabel.textContent = language;
        pre.appendChild(languageLabel);
      }
    });
  }, []);

  return null;
}
