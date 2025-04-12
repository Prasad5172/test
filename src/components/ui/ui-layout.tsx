"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ReactNode, Suspense, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./ui-layout.css";

import { AccountChecker } from "../data-access/account-ui";
import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from "../cluster/cluster-ui";
import { WalletButton } from "../solana/solana-provider";
import {
  GithubOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  MailOutlined,
  TwitterOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const link = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <div className="h-full flex flex-col bg-black fixed inset-0">
      {/* <div className="navbar bg-base-300 text-neutral-content bg-black text-white relative flex justify-center lg:justify-between">
        <div className="lg:w-5/12">
          <Link
            className="btn btn-ghost normal-case text-xl mx-5"
            href="/"
          >
            <b>RCR-DEX</b>
          </Link>
        </div>
        <div className="lg:hidden">
          {!isMenuOpen ? (
            <MenuOutlined
              className="cursor-pointer text-2xl absolute right-[5%] top-[40%]"
              onClick={() => setIsMenuOpen(true)}
            />
          ) : (
            <CloseOutlined
              className="cursor-pointer text-2xl absolute right-[5%] top-[40%]"
              onClick={() => setIsMenuOpen(false)}

            />
          )}
        </div>

        <div className="nav-p-2 space-x-2 flex lg:flex-row lg:w-7/12  lg:justify-between org-nav-component-links  lg:relative">
          <div className="lg:hidden text-center">
            <Link
              className="btn btn-ghost normal-case text-xl mx-5"
              href="/"
            >
              <b>RCR-DEX</b>
            </Link>
          </div>
          <ul className="menu menu-horizontal px-1 space-x-2 flex lg:flex-row ">
            {links.map(({ label, path }) => (
              <li key={path} className="text-center">
                <Link
                  className={`${pathname.startsWith(path) ? "active" : ""} h-[48px] lg:h-[36px] place-content-center`}
                  href={path}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu-buttons flex lg:flex-row relative">
            <WalletButton />
            <ClusterUiSelect />
          </div>
        </div>
      </div> */} 

      <nav className="bg-black text-white relative w-full shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold mx-5 w-max lg:w-4/12 ">
            RCR-DEX
          </Link>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden">
            {!isMenuOpen ? (
              <MenuOutlined
                className="cursor-pointer text-2xl"
                onClick={() => setIsMenuOpen(true)}
              />
            ) : (
              <CloseOutlined
                className="cursor-pointer text-2xl"
                onClick={() => setIsMenuOpen(false)}
              />
            )}
          </div>

          {/* Navbar Links */}
          <ul className={`lg:flex space-x-6 hidden justify-between w-8/12`}>
            <div className="flex items-center">
            {links.map(({ label, path }) => (
              <li key={path} className="mx-3">
                <Link
                  href={path}
                  className={`${
                    pathname.startsWith(path) ? "text-yellow-500" : ""
                  } hover:text-yellow-400 transition`}
                >
                  {label}
                </Link>
              </li>
            ))}
            </div>
            <div className="flex">
            <WalletButton  className="mx-3" />
            <ClusterUiSelect />
            </div>
            </ul>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black text-white absolute top-full left-0 w-full flex flex-col items-center space-y-4 py-4 shadow-md">
            {links.map(({ label, path }) => (
              <Link
                key={path}
                href={path}
                className={`${
                  pathname.startsWith(path) ? "text-yellow-500" : ""
                } hover:text-yellow-400 transition`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="menu-buttons flex lg:flex-row relative">
              <WalletButton />
              <ClusterUiSelect />
            </div>
          </div>
        )}
      </nav>     
      
      <div
        className="bg-black text-white overflow-y-scroll scrollbar-hide relative w-[100%] min-h-[calc(100vh-137px)]"
      >
        <ClusterChecker>
        <AccountChecker />
      </ClusterChecker>
        <Suspense
          fallback={
            <div className="text-center my-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          {children}
        </Suspense>
        <Toaster position="bottom-right" />
      </div>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content bg-black text-white inset-x-0 bottom-0 w-full fixed lg:relative">
        <aside className="flex justify-around" style={{ width: "50%" }}>
          <p>
            <a
              className="link hover:text-white"
              href="https://github.com/ramachandrareddy352/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <GithubOutlined />
              <b className="hidden md:block">&nbsp;Github</b>
            </a>
          </p>
          <p>
            <a
              className="link hover:text-white"
              href="mailto:rcrtavanam@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <MailOutlined />
              <b className="hidden md:block">&nbsp;E-Mail</b>
            </a>
          </p>
          <p>
            <a
              className="link hover:text-white"
              href="https://www.linkedin.com/in/ramachandratavanam/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <LinkedinOutlined />
              <b className="hidden md:block">&nbsp;LinkedIn</b>
            </a>
          </p>
          <p>
            <a
              className="link hover:text-white"
              href="https://x.com/TavanamRama"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <TwitterOutlined />
              <b className="hidden md:block">&nbsp;Twitter</b>
            </a>
          </p>
          <p>
            <a
              className="link hover:text-white"
              href="https://ramachandrareddy.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <GlobalOutlined />
              <b className="hidden md:block">&nbsp;Portfolio</b>
            </a>
          </p>
        </aside>
      </footer>
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || "Save"}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function ellipsify(str = "", len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + ".." + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={"text-center"}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={"View Transaction"}
          className="btn btn-xs btn-primary"
        />
      </div>
    );
  };
}
