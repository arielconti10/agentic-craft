import {
  ArrowUp02Icon,
  Cancel01Icon,
  File01Icon,
  Loading03Icon,
  StopIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ComponentType } from "react"

// ---------------------------------------------------------------------------
// Icon slots for the compound composer.
//
// The eve-chat source hardcodes lucide-react. This port makes the icon family
// injectable via `Composer.Root icons={…}` so the primitive follows the
// consumer's shadcn `iconLibrary` instead of shipping its own. The defaults
// below use Hugeicons because that is this repo's configured icon library
// (components.json → iconLibrary). A lucide consumer passes lucide-backed
// components; nothing else changes.
// ---------------------------------------------------------------------------

type ComposerIconProps = {
  readonly className?: string
}

type ComposerIcons = {
  /** Submit trigger while idle (send arrow). */
  readonly Send: ComponentType<ComposerIconProps>
  /** Submit trigger while busy (stop square). */
  readonly Stop: ComponentType<ComposerIconProps>
  /** Submit trigger while preparing; call sites add the spin classes. */
  readonly Spinner: ComponentType<ComposerIconProps>
  /** File-picker trigger in the footer. */
  readonly Attach: ComponentType<ComposerIconProps>
  /** Media fallback for non-image attachments. */
  readonly File: ComponentType<ComposerIconProps>
  /** Dismiss affordance (info bar close, attachment remove). */
  readonly Dismiss: ComponentType<ComposerIconProps>
}

function SendIcon({ className }: ComposerIconProps) {
  return <HugeiconsIcon icon={ArrowUp02Icon} className={className} />
}

function StopSquareIcon({ className }: ComposerIconProps) {
  return <HugeiconsIcon icon={StopIcon} className={className} />
}

function SpinnerIcon({ className }: ComposerIconProps) {
  return <HugeiconsIcon icon={Loading03Icon} className={className} />
}

function AttachIcon({ className }: ComposerIconProps) {
  return <HugeiconsIcon icon={File01Icon} className={className} />
}

function FileIcon({ className }: ComposerIconProps) {
  return <HugeiconsIcon icon={File01Icon} className={className} />
}

function DismissIcon({ className }: ComposerIconProps) {
  return <HugeiconsIcon icon={Cancel01Icon} className={className} />
}

const DEFAULT_COMPOSER_ICONS: ComposerIcons = {
  Send: SendIcon,
  Stop: StopSquareIcon,
  Spinner: SpinnerIcon,
  Attach: AttachIcon,
  File: FileIcon,
  Dismiss: DismissIcon,
}

export { DEFAULT_COMPOSER_ICONS, type ComposerIconProps, type ComposerIcons }
