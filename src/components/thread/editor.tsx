/* eslint-disable no-nested-ternary */
import {
  forwardRef,
  useCallback,
  useMemo,
  type ComponentProps,
  type PropsWithChildren,
  type Ref,
} from 'react';
import isHotkey from 'is-hotkey';
import {
  Editable,
  withReact,
  useSlate,
  Slate,
  type RenderElementProps,
  type RenderLeafProps,
} from 'slate-react';
import {
  Editor, Transforms, createEditor, Element as SlateElement, type Descendant,
} from 'slate';
import type { CustomElement, CustomText } from 'slate-types';
import {
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  HeadingIcon,
  ListBulletIcon,
  QuoteIcon,
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  UnderlineIcon,
} from '@radix-ui/react-icons';
import { withHistory } from 'slate-history';
import { cn } from 'utils';

type Format = CustomElement['type'] | ListTypes | TextAlignTypes | TextFormatTypes;

const HOTKEYS: Record<string, Format> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const TEXT_FORMAT_TYPES = ['bold', 'italic', 'underline', 'code'] as const;
const LIST_TYPES = ['bulleted-list'] as const;
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'] as const;

type TextFormatTypes = (typeof TEXT_FORMAT_TYPES)[number];
type ListTypes = (typeof LIST_TYPES)[number];
type TextAlignTypes = (typeof TEXT_ALIGN_TYPES)[number];

interface BaseProps extends ComponentProps<'span'> {}

const Button = forwardRef(
  (
    {
      className,
      active,
      reversed = false,
      ...props
    }: PropsWithChildren<
    {
      active: boolean;
      reversed?: boolean;
    } & BaseProps
    >,
    ref: Ref<HTMLSpanElement>,
  ) => (
    <span
      {...props}
      ref={ref}
      className={cn(
        className,
        `block cursor-pointer ${reversed ? (active ? 'text-white' : 'text-zinc-300') : active ? 'bg-emerald-950 text-emerald-200' : 'text-zinc-300'} transition-colors`,
      )}
    />
  ),
);

const Menu = forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<HTMLDivElement>) => (
    <div
      {...props}
      data-test-id="menu"
      ref={ref}
      className={cn(className, 'flex gap-3 justify-between flex-wrap')}
    />
  ),
);

const Toolbar = forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<HTMLDivElement>) => (
    <Menu {...props} ref={ref} className={cn(className, 'bg-zinc-800 px-3 py-1')} />
  ),
);

const isMarkActive = (editor: Editor, format: Format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format as never] === true : false;
};

const toggleMark = (editor: Editor, format: Format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: Format, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n)
        && SlateElement.isElement(n)
        && n[blockType as keyof CustomElement] === format,
    }),
  );

  return !!match;
};

const toggleBlock = (editor: Editor, format: Format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format as TextAlignTypes) ? 'align' : 'type',
  );
  const isList = LIST_TYPES.includes(format as ListTypes);

  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n)
      && SlateElement.isElement(n)
      && LIST_TYPES.includes(n.type as ListTypes)
      && !TEXT_ALIGN_TYPES.includes(format as TextAlignTypes),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format as TextAlignTypes)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : (format as CustomElement['type']),
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] } as CustomElement;
    Transforms.wrapNodes(editor, block);
  }
};

function Element({
  attributes,
  children,
  element,
}: PropsWithChildren<{
  attributes: RenderElementProps['attributes'];
  element: CustomElement & { align?: string };
}>) {
  const style = { textAlign: element.align as AlignSetting | undefined };
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
}

function Leaf({ attributes, leaf, children }: RenderLeafProps) {
  if ((leaf as CustomText).bold) {
    children = <strong>{children}</strong>;
  }

  if ((leaf as CustomText).code) {
    children = <code>{children}</code>;
  }

  if ((leaf as CustomText).italic) {
    children = <em>{children}</em>;
  }

  if ((leaf as CustomText).underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
}

function BlockButton({ format, Icon }: { format: Format; Icon: typeof FontBoldIcon }) {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format as TextAlignTypes) ? 'align' : 'type',
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon className="size-6 align-bottom" />
    </Button>
  );
}

function MarkButton({ format, Icon }: { format: Format; Icon: typeof FontBoldIcon }) {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon className="size-6 align-bottom" />
    </Button>
  );
}

const initialValue: Descendant[] = [
  {
    type: 'heading-two',
    align: 'left',
    children: [{ text: 'Hello World!' }],
  },
];

interface BodyEditorProps {
  onValueChange: (data: Descendant[]) => void;
}

export default function BodyEditor({ onValueChange }: BodyEditorProps) {
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
  const editor = useMemo(() => withReact(withHistory(createEditor())), []);

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={(value) => onValueChange(value)}>
      <div className="bg-zinc-900 ring-0 ring-emerald-400 focus-within:ring-2 border border-zinc-700 transition-all">
        <Toolbar>
          <MarkButton format="bold" Icon={FontBoldIcon} />
          <MarkButton format="italic" Icon={FontItalicIcon} />
          <MarkButton format="underline" Icon={UnderlineIcon} />
          <MarkButton format="code" Icon={CodeIcon} />
          <BlockButton format="heading-one" Icon={HeadingIcon} />
          <BlockButton format="heading-two" Icon={HeadingIcon} />
          <BlockButton format="block-quote" Icon={QuoteIcon} />
          <BlockButton format="bulleted-list" Icon={ListBulletIcon} />
          <BlockButton format="left" Icon={TextAlignLeftIcon} />
          <BlockButton format="center" Icon={TextAlignCenterIcon} />
          <BlockButton format="right" Icon={TextAlignRightIcon} />
          <BlockButton format="justify" Icon={TextAlignJustifyIcon} />
        </Toolbar>
        <Editable
          className=" px-3 py-1 bg-zinc-900 focus:outline-none min-h-48 prose prose-invert max-w-[723px]"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter your thread body…"
          spellCheck
          autoFocus
          onKeyDown={(event) => {
            Object.keys(HOTKEYS).forEach((hotkey) => {
              if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            });
          }}
        />
      </div>
    </Slate>
  );
}
