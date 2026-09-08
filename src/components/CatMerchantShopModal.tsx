import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { 
  ShoppingBag, 
  Sparkles, 
  X, 
  Check, 
  Coins, 
  Zap, 
  Crown, 
  Wand2, 
  Gift, 
  Glasses,
  Flame,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Shirt,
  Swords,
  Eye,
  RotateCw,
  Play,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  PackageCheck,
  Grid
} from 'lucide-react';
import { getCurrentSavedDesign, syncShopEquipmentsToGameInstance } from '../customizer/GameBridge';
import { SHOP_ITEMS, ShopItem } from '../data/shopItemsData';
import { createCustomBear3D, BuiltBearModel } from '../customizer/3dBearBuilder';
import { buildHatMesh, buildFaceMesh, buildBackMesh, buildHandMesh } from '../customizer/equipmentMeshBuilder';
import { hexToInt } from '../customizer/ImageAnalyzer';

interface CatMerchantShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CategoryType = 'all' | 'hats' | 'face' | 'back' | 'skins' | 'hand' | 'auras' | 'potions';
type RarityType = 'all' | 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export const CatMerchantShopModal: React.FC<CatMerchantShopModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<CategoryType>('all');
  const [selectedRarity, setSelectedRarity] = useState<RarityType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'equipped' | 'owned'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'price_low' | 'price_high' | 'rarity'>('featured');
  const [bearPose, setBearPose] = useState<'idle' | 'dance' | 'roar' | 'punch' | 'wave' | 'spin'>('idle');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('super_bear_coins');
    // If no saved coins or was old 999999 / 1000000 test amount, start with 150 coins
    if (!saved || parseInt(saved, 10) >= 900000) {
      localStorage.setItem('super_bear_coins', '150');
      return 150;
    }
    return parseInt(saved, 10);
  });
  
  const [purchasedIds, setPurchasedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('super_bear_purchased_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    // New player starts with starter cape unlocked
    const starterPurchased = ['back_royal_cape'];
    localStorage.setItem('super_bear_purchased_items', JSON.stringify(starterPurchased));
    return starterPurchased;
  });
  
  const [equippedIds, setEquippedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('super_bear_equipped_items');
    if (!saved) {
      const defaultEquipped = ['back_royal_cape'];
      localStorage.setItem('super_bear_equipped_items', JSON.stringify(defaultEquipped));
      return defaultEquipped;
    }
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // If had the old wizard hat or cool glasses default, clean it to starter cape only
        if (parsed.includes('hat_wizard') && parsed.includes('face_glasses_cool')) {
          const cleaned = ['back_royal_cape'];
          localStorage.setItem('super_bear_equipped_items', JSON.stringify(cleaned));
          return cleaned;
        }
        return parsed;
      }
    } catch (e) {}
    return ['back_royal_cape'];
  });
  
  const [notice, setNotice] = useState<string | null>(null);

  // 3D Canvas Refs for Live Bear Preview inside Shop
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bearModelRef = useRef<BuiltBearModel | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const orbitState = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    rotY: 0.3,
    rotX: 0.15,
    distance: 3.2,
    targetY: 1.0,
  });

  // Sync state to localStorage & Game Instance
  useEffect(() => {
    localStorage.setItem('super_bear_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('super_bear_purchased_items', JSON.stringify(purchasedIds));
  }, [purchasedIds]);

  useEffect(() => {
    localStorage.setItem('super_bear_equipped_items', JSON.stringify(equippedIds));
    syncShopEquipmentsToGameInstance(equippedIds);
    update3DBearEquipments();
  }, [equippedIds]);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  // Helper to update 3D Bear model equipments inside the studio canvas
  const update3DBearEquipments = useCallback((targetEquippedIds?: string[]) => {
    if (!bearModelRef.current) return;
    const activeIds = targetEquippedIds || equippedIds;
    const bearRoot = bearModelRef.current.root;
    if (!bearRoot) return;

    // Find or create slot containers
    let hatContainer = bearRoot.getObjectByName('preview_hat_container');
    if (!hatContainer) {
      hatContainer = new THREE.Group();
      hatContainer.name = 'preview_hat_container';
      hatContainer.position.set(0, 1.55, 0.05);
      bearRoot.add(hatContainer);
    }

    let faceContainer = bearRoot.getObjectByName('preview_face_container');
    if (!faceContainer) {
      faceContainer = new THREE.Group();
      faceContainer.name = 'preview_face_container';
      faceContainer.position.set(0, 1.35, 0.38);
      bearRoot.add(faceContainer);
    }

    let backContainer = bearRoot.getObjectByName('preview_back_container');
    if (!backContainer) {
      backContainer = new THREE.Group();
      backContainer.name = 'preview_back_container';
      backContainer.position.set(0, 0.7, -0.42);
      bearRoot.add(backContainer);
    }

    let handContainer = bearRoot.getObjectByName('preview_hand_container');
    if (!handContainer) {
      handContainer = new THREE.Group();
      handContainer.name = 'preview_hand_container';
      handContainer.position.set(0.45, 0.5, 0.25);
      bearRoot.add(handContainer);
    }

    // Clear existing
    [hatContainer, faceContainer, backContainer, handContainer].forEach(container => {
      if (container && container.children) {
        while (container.children.length > 0) {
          container.remove(container.children[0]);
        }
      }
    });

    const design = getCurrentSavedDesign();

    // Attach current equipped items
    activeIds.forEach(id => {
      const itemData = SHOP_ITEMS.find(item => item.id === id);
      const colorInt = itemData?.color ? hexToInt(itemData.color) : 0xf59e0b;

      if (itemData) {
        if (itemData.slot === 'hat' && hatContainer) {
          hatContainer.add(buildHatMesh(id, colorInt));
        } else if (itemData.slot === 'face' && faceContainer) {
          faceContainer.add(buildFaceMesh(id, colorInt));
        } else if (itemData.slot === 'back' && backContainer) {
          backContainer.add(buildBackMesh(id, colorInt));
        } else if (itemData.slot === 'hand' && handContainer) {
          handContainer.add(buildHandMesh(id, colorInt));
        } else if (itemData.slot === 'skin') {
          if (id.includes('gold')) {
            design.palette.furColor = '#f59e0b';
            design.palette.bellyColor = '#fef08a';
            design.materialType = 'gold';
          } else if (id.includes('magma')) {
            design.palette.furColor = '#b91c1c';
            design.palette.bellyColor = '#f97316';
            design.materialType = 'magma';
          } else if (id.includes('cyber')) {
            design.palette.furColor = '#0284c7';
            design.palette.bellyColor = '#38bdf8';
            design.materialType = 'cyber';
          } else if (itemData.color) {
            design.palette.furColor = itemData.color;
          }
        }
      } else {
        if ((id.includes('hat') || id.includes('crown') || id.includes('ears')) && hatContainer) {
          hatContainer.add(buildHatMesh(id, 0xf59e0b));
        } else if ((id.includes('glasses') || id.includes('face') || id.includes('mask')) && faceContainer) {
          faceContainer.add(buildFaceMesh(id, 0x0f172a));
        } else if ((id.includes('cape') || id.includes('back') || id.includes('wing')) && backContainer) {
          backContainer.add(buildBackMesh(id, 0x3b82f6));
        } else if ((id.includes('sword') || id.includes('staff') || id.includes('hand')) && handContainer) {
          handContainer.add(buildHandMesh(id, 0xeab308));
        }
      }
    });

    bearModelRef.current.updateDesign(design);
  }, [equippedIds]);

  // Setup 3D Scene for live bear preview inside modal
  useEffect(() => {
    if (!isOpen || !canvasContainerRef.current) return;
    const container = canvasContainerRef.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    sceneRef.current = scene;

    // Grid Floor
    const grid = new THREE.GridHelper(12, 24, 0x3b82f6, 0x1e293b);
    grid.position.y = 0;
    scene.add(grid);

    // Platform Pedestal for Bear
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8 });
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.2, 32), pedestalMat);
    pedestal.position.y = 0.1;
    scene.add(pedestal);

    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.03, 8, 32), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.21;
    scene.add(ring);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffae0, 1.8);
    dirLight.position.set(4, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    blueRimLight.position.set(-4, 4, -4);
    scene.add(blueRimLight);

    const goldPointLight = new THREE.PointLight(0xf59e0b, 2.0, 8);
    goldPointLight.position.set(0, 2, 2);
    scene.add(goldPointLight);

    // 5. Create 3D Bear Model
    const initialDesign = getCurrentSavedDesign();
    const bearModel = createCustomBear3D(initialDesign);
    scene.add(bearModel.root);
    bearModelRef.current = bearModel;

    // Apply initial equipped items to the bear
    update3DBearEquipments();

    // 6. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Orbit camera positioning
      const { rotY, rotX, distance, targetY } = orbitState.current;
      const x = Math.sin(rotY) * Math.cos(rotX) * distance;
      const y = targetY + Math.sin(rotX) * distance;
      const z = Math.cos(rotY) * Math.cos(rotX) * distance;

      camera.position.set(x, y, z);
      camera.lookAt(0, targetY, 0);

      // Bear pose animation
      if (bearModelRef.current) {
        bearModelRef.current.setAnimationPose(bearPose, time);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current) rendererRef.current.dispose();
      if (bearModelRef.current) bearModelRef.current.destroy();
    };
  }, [isOpen]);

  // Separate effect to update bear equipments without re-creating the entire WebGL scene
  useEffect(() => {
    if (isOpen && bearModelRef.current) {
      update3DBearEquipments();
    }
  }, [equippedIds, isOpen, update3DBearEquipments]);

  // Update bear pose animation
  useEffect(() => {
    if (bearModelRef.current) {
      bearModelRef.current.setAnimationPose(bearPose, 0);
    }
  }, [bearPose]);

  // Orbit Control Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    orbitState.current.isDragging = true;
    orbitState.current.prevX = e.clientX;
    orbitState.current.prevY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!orbitState.current.isDragging) return;
    const deltaX = e.clientX - orbitState.current.prevX;
    const deltaY = e.clientY - orbitState.current.prevY;
    orbitState.current.prevX = e.clientX;
    orbitState.current.prevY = e.clientY;

    orbitState.current.rotY += deltaX * 0.008;
    orbitState.current.rotX = Math.max(-0.4, Math.min(0.8, orbitState.current.rotX + deltaY * 0.008));
  };

  const handleMouseUp = () => {
    orbitState.current.isDragging = false;
  };

  const handleFreeCoins = () => {
    setCoins(prev => prev + 50000);
    setPurchasedIds(SHOP_ITEMS.map(i => i.id));
    showNotification('🎁 +50,000 Altın Para & Tüm 180+ İtem Ücretsiz Açıldı!');
  };

  const handleUnequipAll = () => {
    setEquippedIds([]);
    localStorage.setItem('super_bear_equipped_items', JSON.stringify([]));
    syncShopEquipmentsToGameInstance([]);
    update3DBearEquipments([]);
    showNotification('🧹 Tüm Kuşanılan İtemler Çıkarıldı.');
  };

  const handleBuyOrEquip = (item: ShopItem) => {
    // 1. Ensure item is marked as purchased / unlocked for free if not owned
    if (!purchasedIds.includes(item.id)) {
      setPurchasedIds(prev => [...prev, item.id]);
      setCoins(prev => Math.max(0, prev - (item.price || 0)));
    }

    // 2. Handle Instant Bundles / Buffs
    if (item.effectType === 'add_aliens') {
      const enhancer = (window as any).__superBearSpaceEnhancer;
      if (enhancer && enhancer.updateAliensRescued) {
        enhancer.updateAliensRescued(item.effectValue);
        showNotification(`👽 +${item.effectValue} Uzaylı Göreve Eklendi!`);
      }
      return;
    }

    if (item.effectType === 'buff_speed') {
      const enhancer = (window as any).__superBearSpaceEnhancer;
      if (enhancer && enhancer.teleportDash) {
        enhancer.teleportDash();
      }
      showNotification('⚡ Süper Hız Işınlanması Aktif Edildi!');
      return;
    }

    // 3. Toggle Equip/Unequip based on Slot (Hat, Face, Back, Skin, Hand, Aura)
    let nextEquipped = [...equippedIds];
    const isCurrentlyEquipped = equippedIds.includes(item.id);

    if (isCurrentlyEquipped) {
      // Unequip item
      nextEquipped = nextEquipped.filter(id => id !== item.id);
      showNotification(`❌ ${item.name} Çıkarıldı.`);
    } else {
      // Equip item: replace items in the SAME SLOT so only 1 item per slot is active
      nextEquipped = nextEquipped.filter(id => {
        const match = SHOP_ITEMS.find(i => i.id === id);
        const itemSlot = match?.slot || (id.includes('hat') ? 'hat' : id.includes('face') ? 'face' : id.includes('back') ? 'back' : id.includes('hand') ? 'hand' : id.includes('skin') ? 'skin' : 'aura');
        return itemSlot !== item.slot;
      });
      nextEquipped.push(item.id);
      showNotification(`✨ ${item.name} Ayıya Giydirildi!`);
    }

    setEquippedIds(nextEquipped);
    localStorage.setItem('super_bear_equipped_items', JSON.stringify(nextEquipped));
    syncShopEquipmentsToGameInstance(nextEquipped);
    update3DBearEquipments(nextEquipped);
  };

  // Category counts map
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: SHOP_ITEMS.length };
    SHOP_ITEMS.forEach(item => {
      const cat = item.category === 'aliens' ? 'potions' : item.category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, []);

  // Process items: Filter -> Status -> Search -> Sort
  const processedItems = useMemo(() => {
    let list = SHOP_ITEMS.filter(item => {
      const matchesTab = activeTab === 'all' || item.category === activeTab || (activeTab === 'potions' && (item.category === 'potions' || item.category === 'aliens'));
      const matchesRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
      
      let matchesStatus = true;
      if (filterStatus === 'equipped') {
        matchesStatus = equippedIds.includes(item.id);
      } else if (filterStatus === 'owned') {
        matchesStatus = purchasedIds.includes(item.id);
      }

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.slot.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.rarity && item.rarity.toLowerCase().includes(query));

      return matchesTab && matchesRarity && matchesStatus && matchesSearch;
    });

    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    } else if (sortBy === 'price_low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rarity') {
      const rarityRank = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
      list.sort((a, b) => (rarityRank[b.rarity || 'common'] || 0) - (rarityRank[a.rarity || 'common'] || 0));
    }

    return list;
  }, [activeTab, selectedRarity, filterStatus, searchQuery, sortBy, equippedIds, purchasedIds]);

  // Reset page on filter/search changes
  useEffect(() => {
    setCurrentPage(1);
    setJumpPageInput('');
  }, [activeTab, selectedRarity, filterStatus, searchQuery, sortBy, itemsPerPage]);

  const totalItems = processedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = totalItems === 0 ? 0 : (validPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedItems = processedItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    const target = Math.min(Math.max(1, newPage), totalPages);
    setCurrentPage(target);
  };

  const handleClearFilters = () => {
    setActiveTab('all');
    setSelectedRarity('all');
    setFilterStatus('all');
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const getPaginationPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (validPage > 3) {
        pages.push('...');
      }
      const start = Math.max(2, validPage - 1);
      const end = Math.min(totalPages - 1, validPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (validPage < totalPages - 2) {
        pages.push('...');
      }
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const getRarityBadge = (rarity?: string) => {
    switch (rarity) {
      case 'mythic':
        return <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/50 font-black text-[10px]">MİTİK 🌟</span>;
      case 'legendary':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 font-black text-[10px]">EFSANEVİ 👑</span>;
      case 'epic':
        return <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/50 font-black text-[10px]">EPİK 💜</span>;
      case 'rare':
        return <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/50 font-black text-[10px]">NADİR 💙</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-bold text-[10px]">SIK 🤍</span>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      {/* Giant Studio Modal Container */}
      <div className="relative w-full max-w-7xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-amber-500/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94vh]">
        
        {/* Header */}
        <div className="relative p-3 sm:p-4 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-slate-950 flex items-center justify-between border-b-2 border-amber-400/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border-2 border-amber-200 flex items-center justify-center text-2xl shadow-xl relative animate-bounce">
              🐱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-wider text-slate-950">
                  BAKKAL KEDİ CAPİ & CANLI 3D AYI KOSTÜM MAĞAZASI
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-300 font-black text-xs border border-amber-400/50">
                  180+ İtem 🏪
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 opacity-90 hidden sm:block">
                "Sağdaki dükkandan istediğin zırh, kılıç, gözlük veya pelerini giydir; soldaki 3D Ayı üzerinde ANINDA CANLI GÖR!"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-slate-950/90 hover:bg-slate-950 text-amber-300 hover:text-white transition active:scale-95 cursor-pointer border border-amber-400/50 shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Wallet & Quick Status Bar */}
        <div className="px-4 py-2 bg-slate-900/90 border-b border-amber-500/30 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-300">Cüzdan Bakiye:</span>
            <div className="px-3.5 py-1 bg-amber-500/20 border border-amber-400/60 rounded-xl flex items-center gap-1.5 font-black text-amber-300 text-sm shadow-inner">
              <Coins className="w-4 h-4 text-amber-400 animate-spin" />
              <span>{coins.toLocaleString()} 🪙 Altın</span>
            </div>

            <button
              onClick={handleFreeCoins}
              className="px-3.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl border border-emerald-300 flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
            >
              <Gift className="w-4 h-4" />
              <span>+2,000 Altın Bedava Al!</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-300 text-xs font-bold flex items-center gap-2">
              <Shirt className="w-4 h-4 text-amber-400" />
              <span>Şu An Ayının Üzerinde: <strong className="text-amber-300 font-black">{equippedIds.length} İtem</strong></span>
            </div>

            {equippedIds.length > 0 && (
              <button
                onClick={handleUnequipAll}
                className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 font-bold text-xs rounded-xl flex items-center gap-1 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tümünü Çıkar</span>
              </button>
            )}
          </div>
        </div>

        {/* Notification Toast */}
        {notice && (
          <div className="mx-4 mt-2 p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs text-center border border-amber-200 shadow-xl animate-in fade-in slide-in-from-top-2 shrink-0">
            {notice}
          </div>
        )}

        {/* Main Split-Screen Layout: Left 3D Bear Studio Canvas, Right Shop Grid */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* LEFT PANEL: Live 3D Bear Character Preview */}
          <div className="w-full md:w-[400px] lg:w-[440px] bg-slate-950 border-r border-slate-800 flex flex-col p-3 shrink-0 relative">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-black text-sm">
                <Eye className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>CANLI 3D AYI ÖNİZLEMESİ</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">3D Fare ile Döndür</span>
            </div>

            {/* Three.js Canvas Container */}
            <div 
              ref={canvasContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full flex-1 min-h-[300px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/40 shadow-inner relative cursor-grab active:cursor-grabbing overflow-hidden"
            >
              {/* Overlay Guidance */}
              <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between pointer-events-none">
                <span>🔄 Çevir / Yakınlaş</span>
                <span className="text-amber-400 font-black">CANLI 3D DÖNÜŞÜM</span>
              </div>
            </div>

            {/* Animation Pose Controls for the Bear */}
            <div className="mt-2.5 p-2 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-black text-amber-300 px-1 block">🐻 Ayı Hareket Testi:</span>
              <div className="grid grid-cols-3 gap-1">
                {(['idle', 'dance', 'roar', 'punch', 'wave', 'spin'] as const).map(pose => (
                  <button
                    key={pose}
                    onClick={() => setBearPose(pose)}
                    className={`py-1 px-2 rounded-xl text-[11px] font-bold capitalize transition cursor-pointer flex items-center justify-center gap-1 ${
                      bearPose === pose
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Play className="w-3 h-3" />
                    <span>{pose === 'idle' ? 'Duruş' : pose === 'dance' ? 'Dans' : pose === 'roar' ? 'Kükre' : pose === 'punch' ? 'Yumruk' : pose === 'wave' ? 'El Salla' : 'Dön'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: 180+ Shop Catalog & Categories */}
          <div className="flex-1 flex flex-col bg-slate-950 min-h-0">
            
            {/* Search & Filter Bar */}
            <div className="p-3 bg-slate-900/90 border-b border-slate-800 space-y-2.5 shrink-0">
              
              {/* Top Control Row: Search + Sort + Rarity */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="180+ İtem ara... (örn: Tac, Viking, Kılıç, Ejderha, Alev, Pelerin)"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-black p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-amber-400 hidden sm:block" />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="featured">Sıralama: Öne Çıkanlar</option>
                    <option value="name">Sıralama: İsim (A-Z)</option>
                    <option value="price_low">Sıralama: Fiyat (Düşük ➔ Yüksek)</option>
                    <option value="price_high">Sıralama: Fiyat (Yüksek ➔ Düşük)</option>
                    <option value="rarity">Sıralama: En Nadirler</option>
                  </select>
                </div>

                {/* Rarity Dropdown Filter */}
                <select
                  value={selectedRarity}
                  onChange={e => setSelectedRarity(e.target.value as RarityType)}
                  className="px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500 cursor-pointer shrink-0"
                >
                  <option value="all">Tüm Nadirlikler</option>
                  <option value="common">Sık (Common)</option>
                  <option value="rare">Nadir (Rare)</option>
                  <option value="epic">Epik (Epic)</option>
                  <option value="legendary">Efsanevi (Legendary)</option>
                  <option value="mythic">Mitik (Mythic)</option>
                </select>
              </div>

              {/* Status Quick Filter Pills */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs border-t border-slate-800/80 pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Filtre:</span>
                  
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                      filterStatus === 'all'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Grid className="w-3 h-3" />
                    <span>Tümü ({SHOP_ITEMS.length})</span>
                  </button>

                  <button
                    onClick={() => setFilterStatus('equipped')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                      filterStatus === 'equipped'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    <span>✨ Sadece Takılı ({equippedIds.length})</span>
                  </button>

                  <button
                    onClick={() => setFilterStatus('owned')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                      filterStatus === 'owned'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <PackageCheck className="w-3 h-3 text-emerald-400" />
                    <span>✅ Envanterim ({purchasedIds.length})</span>
                  </button>
                </div>

                {/* Items per Page Selector */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span>Sayfa Başına:</span>
                  {[12, 18, 24, 36].map(size => (
                    <button
                      key={size}
                      onClick={() => setItemsPerPage(size)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                        itemsPerPage === size
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'all'
                      ? 'bg-amber-500 text-slate-950 shadow-lg'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Tüm İtemler ({categoryCounts.all || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('skins')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'skins'
                      ? 'bg-amber-500 text-slate-950 shadow-lg'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>👑 Zırh & Deriler ({categoryCounts.skins || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('hand')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'hand'
                      ? 'bg-amber-500 text-slate-950 shadow-lg'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>⚔️ Silah & Elde ({categoryCounts.hand || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('hats')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'hats'
                      ? 'bg-amber-500 text-slate-950 shadow-lg'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>🧙‍♂️ Şapkalar ({categoryCounts.hats || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('face')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'face'
                      ? 'bg-amber-500 text-slate-950 shadow-lg'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Glasses className="w-3.5 h-3.5" />
                  <span>🕶️ Yüz & Gözlük ({categoryCounts.face || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('back')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'back'
                      ? 'bg-amber-500 text-slate-950 shadow-lg'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Shirt className="w-3.5 h-3.5" />
                  <span>🎒 Sırt & Pelerin ({categoryCounts.back || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('auras')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'auras'
                      ? 'bg-amber-500 text-slate-950 shadow-lg'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>✨ Auralar ({categoryCounts.auras || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('potions')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'potions'
                      ? 'bg-amber-500 text-slate-950 shadow-lg'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>🧪 İksirler ({categoryCounts.potions || 0})</span>
                </button>
              </div>
            </div>

            {/* Results Header Info Bar */}
            <div className="px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-300">
                  Gösterilen: <strong className="text-amber-300">{totalItems === 0 ? 0 : startIndex + 1} - {endIndex}</strong> / Toplam <strong className="text-amber-300">{totalItems}</strong> İtem
                </span>
                {searchQuery && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-400/40 text-[10px] font-bold">
                    Arama: "{searchQuery}"
                  </span>
                )}
              </div>

              <div className="font-bold text-slate-400">
                Sayfa <span className="text-amber-300 font-black">{validPage}</span> / {totalPages}
              </div>
            </div>

            {/* Item Catalog Grid Container */}
            <div className="p-3 sm:p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-slate-100 scrollbar-thin">
              {paginatedItems.length === 0 ? (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl">
                    🔍
                  </div>
                  <div className="text-center">
                    <p className="font-black text-sm text-amber-200">Aradığınız kriterlere uygun item bulunamadı.</p>
                    <p className="text-xs text-slate-500 mt-1">Arama terimini değiştirmeyi veya filtreleri temizlemeyi deneyin.</p>
                  </div>
                  <button
                    onClick={handleClearFilters}
                    className="mt-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs rounded-xl border border-amber-400/40 transition cursor-pointer"
                  >
                    🧹 Tüm Filtreleri Temizle
                  </button>
                </div>
              ) : (
                paginatedItems.map(item => {
                  const isOwned = purchasedIds.includes(item.id);
                  const isEquipped = equippedIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleBuyOrEquip(item)}
                      className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all duration-200 relative overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] select-none ${
                        isEquipped
                          ? 'bg-gradient-to-br from-amber-950/90 to-slate-900 border-amber-400 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/60'
                          : isOwned
                          ? 'bg-slate-900/90 border-emerald-500/60 hover:border-emerald-400'
                          : 'bg-slate-900/50 border-slate-800 hover:border-amber-500/50'
                      }`}
                    >
                      <div>
                        {/* Item Card Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h3 className="font-black text-xs sm:text-sm text-amber-200 leading-tight">
                              {item.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              {getRarityBadge(item.rarity)}
                              <span className="text-[10px] text-slate-400 font-mono capitalize">
                                [{item.slot}]
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-400/30 px-2.5 py-1 rounded-xl text-amber-300 font-black text-xs shrink-0">
                            <span>{item.price}</span>
                            <span>🪙</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-300 font-medium mb-3 leading-snug">
                          {item.description}
                        </p>
                      </div>

                      {/* Item Card Action Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] font-bold text-slate-400">
                          {isEquipped ? '✨ Ayının Üzerinde Takılı' : isOwned ? '✅ Envanterinde' : '🛒 Satın Alınabilir'}
                        </span>

                        <button
                          onClick={() => handleBuyOrEquip(item)}
                          className={`px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md ${
                            isEquipped
                              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 ring-2 ring-amber-300'
                              : isOwned
                              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
                          }`}
                        >
                          {isEquipped ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Çıkar</span>
                            </>
                          ) : isOwned ? (
                            <>
                              <Sparkles className="w-3.5 h-3.5 animate-spin" />
                              <span>Dene & Giydir</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>{item.price} 🪙 Al & Dene</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Controls Bar */}
            <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
              
              {/* Pagination Page Number Buttons */}
              <div className="flex items-center gap-1 flex-wrap">
                
                {/* First Page Button */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={validPage === 1}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                  title="İlk Sayfa"
                >
                  <ChevronsLeft className="w-4 h-4 text-amber-400" />
                </button>

                {/* Previous Page Button */}
                <button
                  onClick={() => handlePageChange(validPage - 1)}
                  disabled={validPage === 1}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer flex items-center gap-1 font-bold text-xs"
                >
                  <ChevronLeft className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Önceki</span>
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1 mx-1">
                  {getPaginationPages().map((page, idx) => {
                    if (typeof page === 'string') {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-1.5 py-1 text-slate-500 font-bold">
                          ...
                        </span>
                      );
                    }

                    const isActive = page === validPage;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`min-w-[32px] h-[30px] px-2 rounded-lg text-xs font-black transition cursor-pointer ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300'
                            : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page Button */}
                <button
                  onClick={() => handlePageChange(validPage + 1)}
                  disabled={validPage === totalPages}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer flex items-center gap-1 font-bold text-xs"
                >
                  <span className="hidden sm:inline">Sonraki</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>

                {/* Last Page Button */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={validPage === totalPages}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                  title="Son Sayfa"
                >
                  <ChevronsRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>

              {/* Direct Page Jump Form */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const targetNum = parseInt(jumpPageInput, 10);
                  if (!isNaN(targetNum)) {
                    handlePageChange(targetNum);
                    setJumpPageInput('');
                  }
                }}
                className="flex items-center gap-1.5 text-slate-400 text-xs font-bold"
              >
                <span>Sayfaya Git:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  placeholder={validPage.toString()}
                  value={jumpPageInput}
                  onChange={e => setJumpPageInput(e.target.value)}
                  className="w-12 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-center text-amber-300 font-black text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-lg font-bold transition cursor-pointer"
                >
                  Git
                </button>
              </form>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>🐱 Bakkal Kedi Capi • Toplam {SHOP_ITEMS.length} Adet Takı, Zırh ve Kostüm • Canlı 3D Önizleme Destekli</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black transition cursor-pointer border border-slate-700"
          >
            Kapat ve Oyuna Dön
          </button>
        </div>

      </div>

    </div>
  );
};
