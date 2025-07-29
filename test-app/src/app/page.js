"use client";

import { Flex, Box, Heading, Text, VStack, HStack } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Line, Doughnut, Bar, Pie, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement,
  RadialLinearScale
);

// カスタムカラーパレット - ベースカラー#6988A9の濃淡（明→暗の順）
const horizonColors = {
  primary: "#B8CDE0", // 1. 最ライト（20%明るく）
  secondary: "#A3BFDB", // 2. ライト（15%明るく）
  success: "#8FA8C7", // 3. ミディアムライト（10%明るく）
  error: "#7A98BA", // 4. ライト（5%明るく）
  warning: "#6988A9", // 5. ベースカラー
  info: "#5C7A95", // 6. ミディアムダーク（10%暗く）
  purple: "#4F6C82", // 7. ダーク（15%暗く）
  pink: "#425E6F", // 8. ミディアムダーク2（20%暗く）
  orange: "#36505C", // 9. ダーク2（25%暗く）
  teal: "#294248", // 10. 最ダーク（30%暗く）
  indigo: "#1F3135", // 11. 超ダーク（35%暗く）
  cyan: "#152122", // 12. 極ダーク（40%暗く）
  focus: "#AAC678", // フォーカスカラー（緑系アクセント）
  gradient: "linear-gradient(135deg, #6988A9 0%, #8FA8C7 100%)",
  cardBg: "#FFFFFF",
  textPrimary: "#1E293B",
  textSecondary: "#64748B",
  borderColor: "#E2E8F0",
};

// カスタム矢印アイコンコンポーネント
const ArrowUpIcon = ({ color = "#AAC678" }) => (
  <Box as="span" display="inline-block" mr={1}>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M6 2L10 6L8.5 7.5L6.75 5.75V10H5.25V5.75L3.5 7.5L2 6L6 2Z"
        fill={color}
      />
    </svg>
  </Box>
);

ArrowUpIcon.propTypes = {
  color: PropTypes.string,
};

const ArrowDownIcon = ({ color = "#36505C" }) => (
  <Box as="span" display="inline-block" mr={1}>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M6 10L2 6L3.5 4.5L5.25 6.25V2H6.75V6.25L8.5 4.5L10 6L6 10Z"
        fill={color}
      />
    </svg>
  </Box>
);

ArrowDownIcon.propTypes = {
  color: PropTypes.string,
};

// カスタム統計カードコンポーネント
const StatCard = ({
  label,
  value,
  helpText,
  valueColor,
  helpTextColor,
  icon,
  ...props
}) => (
  <Box
    bg="white"
    p={6}
    borderRadius="20px"
    boxShadow="0 20px 40px rgba(0, 0, 0, 0.1)"
    minW="200px"
    textAlign="center"
    border="1px solid"
    borderColor="gray.100"
    {...props}
  >
    <Text color="gray.600" fontSize="sm" fontWeight="600" mb={2}>
      {label}
    </Text>
    <Text color={valueColor} fontSize="2xl" fontWeight="700" mb={2}>
      {value}
    </Text>
    {helpText && (
      <Text color={helpTextColor} fontSize="sm" fontWeight="500">
        {icon}
        {helpText}
      </Text>
    )}
  </Box>
);

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  valueColor: PropTypes.string,
  helpTextColor: PropTypes.string,
  icon: PropTypes.node,
};

// グラデーション作成関数
const createGradient = (ctx, chartArea) => {
  const gradient = ctx.createLinearGradient(
    0,
    chartArea.bottom,
    0,
    chartArea.top
  );
  gradient.addColorStop(0, "rgba(184, 205, 224, 0.05)"); // primary color
  gradient.addColorStop(0.5, "rgba(184, 205, 224, 0.15)");
  gradient.addColorStop(1, "rgba(184, 205, 224, 0.3)");
  return gradient;
};

// 共通チャートオプション
const getCommonOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      titleColor: horizonColors.textPrimary,
      bodyColor: horizonColors.textSecondary,
      borderColor: horizonColors.borderColor,
      borderWidth: 1,
      cornerRadius: 12,
      padding: 16,
      displayColors: true,
      titleFont: {
        size: 14,
        weight: "600",
      },
      bodyFont: {
        size: 13,
      },
    },
  },
  animation: {
    duration: 2000,
    easing: "easeInOutQuart",
  },
});

// チャートコンテナコンポーネント
const ChartContainer = ({ title, subtitle, children, ...props }) => (
  <Box
    bg="white"
    p={6}
    borderRadius="20px"
    boxShadow="0 20px 40px rgba(0, 0, 0, 0.1)"
    border="1px solid"
    borderColor="gray.100"
    position="relative"
    overflow="hidden"
    transition="all 0.3s ease"
    _hover={{
      transform: "translateY(-4px)",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
    }}
    {...props}
  >
    <VStack align="start" spacing={2} mb={4}>
      <Heading size="md" color={horizonColors.textPrimary} fontWeight="700">
        {title}
      </Heading>
      {subtitle && (
        <Text
          color={horizonColors.textSecondary}
          fontSize="sm"
          fontWeight="500"
        >
          {subtitle}
        </Text>
      )}
    </VStack>
    <Box h="300px" w="full">
      {children}
    </Box>
  </Box>
);

ChartContainer.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// 1. ラインチャート - 売上推移
const lineData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "売上高 (万円)",
      data: [420, 580, 450, 720, 890, 650, 980, 1120, 850, 1250, 1380, 1450],
      borderColor: horizonColors.warning, // ベースカラー
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const chartArea = context.chart.chartArea;
        if (!chartArea) return null;
        return createGradient(ctx, chartArea);
      },
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: "#FFFFFF",
      pointBorderColor: horizonColors.warning, // ベースカラー
      pointBorderWidth: 3,
      fill: true,
    },
  ],
};

// 2. ドーナツチャート - 売上構成
const doughnutData = {
  labels: ["Enterprise", "SMB", "Startup", "Government"],
  datasets: [
    {
      data: [45, 30, 15, 10],
      backgroundColor: [
        horizonColors.primary, // 1. 最ライト
        horizonColors.secondary, // 2. ライト
        horizonColors.success, // 3. ミディアムライト
        horizonColors.error, // 4. ライト
      ],
      hoverBackgroundColor: [
        horizonColors.focus, // フォーカスカラー
        horizonColors.focus,
        horizonColors.focus,
        horizonColors.focus,
      ],
      borderWidth: 0,
      cutout: "70%",
    },
  ],
};

// 3. 棒グラフ - 地域別売上
const barData = {
  labels: ["Tokyo", "Osaka", "Nagoya", "Fukuoka", "Sendai", "Sapporo"],
  datasets: [
    {
      label: "売上 (億円)",
      data: [25, 18, 12, 8, 6, 5], // 平均: 12.33 → Nagoya(12)が最も平均に近い
      backgroundColor: [
        horizonColors.primary, // 1. Tokyo: 最ライト
        horizonColors.secondary, // 2. Osaka: ライト
        horizonColors.focus, // 3. Nagoya: フォーカスカラー（平均に最も近い）
        horizonColors.error, // 4. Fukuoka: ライト
        horizonColors.warning, // 5. Sendai: ベースカラー
        horizonColors.info, // 6. Sapporo: ミディアムダーク
      ],
      hoverBackgroundColor: [
        horizonColors.focus, // ホバー時フォーカスカラー
        horizonColors.focus,
        horizonColors.focus,
        horizonColors.focus,
        horizonColors.focus,
        horizonColors.focus,
      ],
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
};

// 4. 円グラフ - マーケット占有率
const pieData = {
  labels: ["自社", "競合A", "競合B", "競合C", "その他"],
  datasets: [
    {
      data: [35, 25, 20, 10, 10],
      backgroundColor: [
        horizonColors.focus, // 1. 自社: フォーカスカラー（最も値が大きい35%）
        horizonColors.secondary, // 2. 競合A: ライト
        horizonColors.success, // 3. 競合B: ミディアムライト
        horizonColors.error, // 4. 競合C: ライト
        horizonColors.warning, // 5. その他: ベースカラー
      ],
      hoverBackgroundColor: [
        horizonColors.focus, // 自社: フォーカスカラー維持
        horizonColors.focus, // 競合A: ホバー時フォーカスカラー
        horizonColors.focus, // 競合B: ホバー時フォーカスカラー
        horizonColors.focus, // 競合C: ホバー時フォーカスカラー
        horizonColors.focus, // その他: ホバー時フォーカスカラー
      ],
      borderWidth: 0,
    },
  ],
};

// 5. レーダーチャート - パフォーマンス評価
const radarData = {
  labels: ["Quality", "Speed", "Cost", "Innovation", "Support", "Reliability"],
  datasets: [
    {
      label: "自社",
      data: [85, 90, 75, 88, 92, 87],
      backgroundColor: "rgba(184, 205, 224, 0.2)", // primary color
      borderColor: horizonColors.warning, // ベースカラー
      borderWidth: 3,
      pointBackgroundColor: horizonColors.warning, // ベースカラー
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverBackgroundColor: horizonColors.focus, // ホバー時フォーカスカラー
      pointHoverBorderColor: "#fff",
    },
    {
      label: "業界平均",
      data: [70, 75, 80, 65, 70, 75],
      backgroundColor: "rgba(163, 191, 219, 0.2)", // secondary color
      borderColor: horizonColors.secondary,
      borderWidth: 2,
      pointBackgroundColor: horizonColors.secondary,
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
    },
  ],
};

// 6. エリアチャート - 月次KPI
const areaData = {
  labels: ["Q1", "Q2", "Q3", "Q4"],
  datasets: [
    {
      label: "Customer Satisfaction",
      data: [85, 88, 92, 95],
      backgroundColor: "rgba(143, 168, 199, 0.3)", // success color
      borderColor: horizonColors.success,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointHoverBackgroundColor: horizonColors.focus, // ホバー時フォーカスカラー
    },
    {
      label: "Employee Engagement",
      data: [78, 82, 86, 89],
      backgroundColor: "rgba(105, 136, 169, 0.3)", // warning color (ベースカラー)
      borderColor: horizonColors.warning,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    },
    {
      label: "Innovation Index",
      data: [72, 75, 81, 87],
      backgroundColor: "rgba(92, 122, 149, 0.3)", // info color
      borderColor: horizonColors.info,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    },
  ],
};

// 7. 横棒グラフ - フリーミアム制限データ
const horizontalBarData = {
  labels: [
    "User Growth",
    "Revenue",
    "Traffic",
    "Engagement",
    "Conversion",
    "Retention",
  ],
  datasets: [
    {
      label: "Available Data (Free Plan)",
      data: [75, 60, 85, 45, 70, 55], // フリープランで見える範囲
      backgroundColor: [
        horizonColors.primary, // 1. 最ライト
        horizonColors.secondary, // 2. ライト
        horizonColors.success, // 3. ミディアムライト
        horizonColors.error, // 4. ライト
        horizonColors.warning, // 5. ベースカラー
        horizonColors.info, // 6. ミディアムダーク
      ],
      hoverBackgroundColor: [
        horizonColors.focus, // ホバー時フォーカスカラー
        horizonColors.focus,
        horizonColors.focus,
        horizonColors.focus,
        horizonColors.focus,
        horizonColors.focus,
      ],
      borderRadius: 6,
      borderSkipped: false,
    },
  ],
};

// フリーミアム用のカスタムプラグイン
const freemiumPlugin = {
  id: "freemium",
  afterDraw: (chart) => {
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;

    // グレーアウトエリア（課金プランで見える部分）
    ctx.save();
    ctx.fillStyle = "rgba(100, 116, 139, 0.1)";
    ctx.fillRect(
      chartArea.left + chartArea.width * 0.75,
      chartArea.top,
      chartArea.width * 0.25,
      chartArea.bottom - chartArea.top
    );

    // 境界線
    ctx.strokeStyle = "rgba(100, 116, 139, 0.3)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(chartArea.left + chartArea.width * 0.75, chartArea.top);
    ctx.lineTo(chartArea.left + chartArea.width * 0.75, chartArea.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // ロックアイコンとテキスト
    ctx.fillStyle = "#64748B";
    ctx.font = "bold 14px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "🔒 Pro Features",
      chartArea.left + chartArea.width * 0.875,
      chartArea.top + (chartArea.bottom - chartArea.top) / 2 - 10
    );

    ctx.font = "11px Inter, system-ui, sans-serif";
    ctx.fillText(
      "Upgrade to view",
      chartArea.left + chartArea.width * 0.875,
      chartArea.top + (chartArea.bottom - chartArea.top) / 2 + 10
    );

    ctx.restore();
  },
};

// フリーミアム対応チャートコンテナ
const FreemiumChartContainer = ({
  title,
  subtitle,
  children,
  onUpgrade,
  ...props
}) => (
  <Box
    bg="white"
    p={6}
    borderRadius="20px"
    boxShadow="0 20px 40px rgba(0, 0, 0, 0.1)"
    border="1px solid"
    borderColor="gray.100"
    position="relative"
    overflow="hidden"
    transition="all 0.3s ease"
    _hover={{
      transform: "translateY(-4px)",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
    }}
    {...props}
  >
    <VStack align="start" spacing={2} mb={4}>
      <HStack justify="space-between" w="full">
        <VStack align="start" spacing={1}>
          <Heading size="md" color={horizonColors.textPrimary} fontWeight="700">
            {title}
          </Heading>
          {subtitle && (
            <Text
              color={horizonColors.textSecondary}
              fontSize="sm"
              fontWeight="500"
            >
              {subtitle}
            </Text>
          )}
        </VStack>
        <Box
          bg="linear-gradient(135deg, #6988A9, #A3BFDB)"
          color="white"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          fontWeight="600"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{
            transform: "scale(1.05)",
            boxShadow: "0 4px 12px rgba(105, 136, 169, 0.4)",
          }}
          onClick={onUpgrade}
        >
          ⚡ Upgrade
        </Box>
      </HStack>
    </VStack>
    <Box h="300px" w="full" position="relative">
      {children}
      {/* フリープラン制限オーバーレイ */}
      <Box
        position="absolute"
        top={0}
        right={0}
        w="25%"
        h="full"
        bg="linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 20%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        borderRadius="0 20px 20px 0"
      >
        <Text fontSize="lg" mb={1}>
          🔒
        </Text>
        <Text
          fontSize="xs"
          color="gray.600"
          fontWeight="600"
          textAlign="center"
          px={2}
        >
          Pro Plan
          <br />
          Features
        </Text>
      </Box>
    </Box>
  </Box>
);

FreemiumChartContainer.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  onUpgrade: PropTypes.func,
};

// チャートオプション
const lineOptions = {
  ...getCommonOptions(),
  scales: {
    x: {
      border: { display: false },
      grid: { display: false },
      ticks: {
        color: horizonColors.textSecondary,
        font: { size: 12, weight: "500" },
      },
    },
    y: {
      border: { display: false },
      grid: { color: "rgba(226, 232, 240, 0.6)", drawBorder: false },
      ticks: {
        color: horizonColors.textSecondary,
        font: { size: 12, weight: "500" },
        callback: (value) => `¥${value.toLocaleString()}`,
      },
      beginAtZero: true,
    },
  },
};

const doughnutOptions = {
  ...getCommonOptions(),
  plugins: {
    ...getCommonOptions().plugins,
    legend: {
      display: true,
      position: "bottom",
      labels: {
        padding: 20,
        usePointStyle: true,
        font: { size: 12, weight: "500" },
        color: horizonColors.textSecondary,
      },
    },
  },
  cutout: "70%",
};

const barOptions = {
  ...getCommonOptions(),
  scales: {
    x: {
      border: { display: false },
      grid: { display: false },
      ticks: {
        color: horizonColors.textSecondary,
        font: { size: 12, weight: "500" },
      },
    },
    y: {
      border: { display: false },
      grid: { color: "rgba(226, 232, 240, 0.6)", drawBorder: false },
      ticks: {
        color: horizonColors.textSecondary,
        font: { size: 12, weight: "500" },
        callback: (value) => `${value}億`,
      },
      beginAtZero: true,
    },
  },
};

const pieOptions = {
  ...getCommonOptions(),
  plugins: {
    ...getCommonOptions().plugins,
    legend: {
      display: true,
      position: "bottom",
      labels: {
        padding: 20,
        usePointStyle: true,
        font: { size: 12, weight: "500" },
        color: horizonColors.textSecondary,
      },
    },
  },
};

const radarOptions = {
  ...getCommonOptions(),
  plugins: {
    ...getCommonOptions().plugins,
    legend: {
      display: true,
      position: "bottom",
      labels: {
        padding: 20,
        usePointStyle: true,
        font: { size: 12, weight: "500" },
        color: horizonColors.textSecondary,
      },
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 20,
        color: horizonColors.textSecondary,
        font: { size: 10 },
      },
      grid: {
        color: "rgba(226, 232, 240, 0.6)",
      },
      pointLabels: {
        color: horizonColors.textPrimary,
        font: { size: 12, weight: "600" },
      },
    },
  },
};

const areaOptions = {
  ...getCommonOptions(),
  plugins: {
    ...getCommonOptions().plugins,
    legend: {
      display: true,
      position: "bottom",
      labels: {
        padding: 20,
        usePointStyle: true,
        font: { size: 12, weight: "500" },
        color: horizonColors.textSecondary,
      },
    },
  },
  scales: {
    x: {
      border: { display: false },
      grid: { display: false },
      ticks: {
        color: horizonColors.textSecondary,
        font: { size: 12, weight: "500" },
      },
    },
    y: {
      border: { display: false },
      grid: { color: "rgba(226, 232, 240, 0.6)", drawBorder: false },
      ticks: {
        color: horizonColors.textSecondary,
        font: { size: 12, weight: "500" },
        callback: (value) => `${value}%`,
      },
      beginAtZero: true,
      max: 100,
    },
  },
};

const horizontalBarOptions = {
  ...getCommonOptions(),
  indexAxis: "y", // 横棒にする
  plugins: {
    ...getCommonOptions().plugins,
    legend: { display: false },
    freemium: freemiumPlugin, // カスタムプラグインを追加
  },
  scales: {
    x: {
      border: { display: false },
      grid: { color: "rgba(226, 232, 240, 0.6)", drawBorder: false },
      ticks: {
        color: horizonColors.textSecondary,
        font: { size: 12, weight: "500" },
        callback: (value) => `${value}%`,
      },
      beginAtZero: true,
      max: 100, // フリープランは100%まで見える設定
    },
    y: {
      border: { display: false },
      grid: { display: false },
      ticks: {
        color: horizonColors.textSecondary,
        font: { size: 12, weight: "500" },
      },
    },
  },
};

export default function Home() {
  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #4F6C82 0%, #A3BFDB 100%)"
      p={8}
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        maxW="1400px"
        mx="auto"
      >
        {/* ヘッダーセクション */}
        <VStack spacing={6} mb={12} textAlign="center">
          <Heading
            size="2xl"
            color="white"
            fontWeight="800"
            letterSpacing="-0.025em"
            textShadow="0 4px 6px rgba(0, 0, 0, 0.3)"
          >
            Executive Analytics Dashboard
          </Heading>
          <Text
            color="whiteAlpha.900"
            fontSize="lg"
            maxW="800px"
            fontWeight="500"
          >
            Fortune
            500企業スタイルの包括的ビジネスインテリジェンスダッシュボード
          </Text>
        </VStack>

        {/* 統計カードセクション */}
        <HStack spacing={6} mb={12} w="full" justify="center">
          <StatCard
            label="Annual Revenue"
            value="$2.4B"
            helpText="12.5% YoY"
            valueColor={horizonColors.primary}
            helpTextColor={horizonColors.focus}
            icon={<ArrowUpIcon />}
          />

          <StatCard
            label="Market Share"
            value="34.8%"
            helpText="vs Competition"
            valueColor={horizonColors.success}
            helpTextColor={horizonColors.focus}
            icon={<ArrowUpIcon />}
          />

          <StatCard
            label="Customer Satisfaction"
            value="94.2%"
            helpText="Industry Leading"
            valueColor={horizonColors.warning}
            helpTextColor="gray.600"
          />

          <StatCard
            label="Employee Engagement"
            value="89.1%"
            helpText="Top 5% Global"
            valueColor={horizonColors.info}
            helpTextColor={horizonColors.focus}
            icon={<ArrowUpIcon />}
          />
        </HStack>

        {/* 7つのグラフセクション */}
        <Box w="full">
          <Box
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            gap={6}
            w="full"
          >
            {/* ラインチャート */}
            <ChartContainer
              title="Revenue Trend"
              subtitle="Monthly performance 2024"
            >
              <Line data={lineData} options={lineOptions} />
            </ChartContainer>

            {/* ドーナツチャート */}
            <ChartContainer
              title="Customer Segments"
              subtitle="Revenue distribution by segment"
            >
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </ChartContainer>

            {/* 棒グラフ */}
            <ChartContainer
              title="Regional Performance"
              subtitle="Sales by major cities"
            >
              <Bar data={barData} options={barOptions} />
            </ChartContainer>

            {/* 円グラフ */}
            <ChartContainer
              title="Market Position"
              subtitle="Competitive landscape analysis"
            >
              <Pie data={pieData} options={pieOptions} />
            </ChartContainer>

            {/* レーダーチャート */}
            <ChartContainer
              title="Performance Matrix"
              subtitle="Key metrics vs industry average"
            >
              <Radar data={radarData} options={radarOptions} />
            </ChartContainer>

            {/* エリアチャート */}
            <ChartContainer
              title="Strategic KPIs"
              subtitle="Quarterly performance indicators"
            >
              <Line data={areaData} options={areaOptions} />
            </ChartContainer>

            {/* フリーミアム横棒グラフ */}
            <FreemiumChartContainer
              title="Analytics Overview"
              subtitle="Free plan: Limited data view"
              onUpgrade={() =>
                alert(
                  "Upgrade to Pro Plan!\n\n✨ Unlock full data insights\n📊 Advanced analytics\n🔄 Real-time updates\n💎 Premium features"
                )
              }
              gridColumn="span 3"
            >
              <Bar
                data={horizontalBarData}
                options={horizontalBarOptions}
                plugins={[freemiumPlugin]}
              />
            </FreemiumChartContainer>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
